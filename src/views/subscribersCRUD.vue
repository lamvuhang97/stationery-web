<template>
  <div>
    <custom-form :formbuilder="formbuilder" :recordId="id" @form-save-click="save" @send-reset-pw="sendResetPassword" @add-entitlement="addEntitlement"></custom-form>
  </div>
</template>

<script>
import { required } from "vuelidate/lib/validators";
import moment from 'moment'

export default {
  name: "SubscribersCreate",
  data() {
    return {
      id: "",
      formbuilder: {
        heading: "Create Subscriber",
        columns: [
          {
            label: "Email",
            field: "email",
            value: "",
            inputemail: true,
            validate: {
              required
            }
          },
          {
            label: "First Name",
            field: "first_name",
            value: "",
            inputtype: true
          },
          {
            label: "Last Name",
            field: "last_name",
            value: "",
            inputtype: true
          }
        ],
        disabledSave: false,
        buttonsavelabel: "Save",
        reloadFormbuilder: true
      },
      entitlementIdx: 0,
      planIdx: 0,
      entitlementData: [],
      email: "",
      entitlements: [],
    };
  },
  methods: {
    async save(params) {
      this.formbuilder.disabledSave = true;
      var response;
      var data = {
        attributes: {
          email: params.email,
          first_name: params.first_name,
          last_name: params.last_name
        },
        id: this.$route.params.id,
        type: "subscriber"
      }
      if (this.$route.params.id) {
        response = await this.$api.subscribers.update(this.$route.params.id, data);
        if (response != null) {
          this.formbuilder.disabledSave = true;
        }
        if (response.status < 300) {
          this.$toasted.success("Subscriber Updated");
        }
      } else {
        data.attributes.password = params.password
        response = await this.$api.subscribers.create(data);
        if (response != null) {
          this.formbuilder.disabledSave = false;
        }
        if (response.status === 201) {
          this.$toasted.success("Subscriber Created");
        }
      }
      if (response.status < 300) {
        this.$router.push({ name: "Subscribers" });
      } else {
        this.$toasted.error(response.message);
      }
    },
    selectedEntitlementIsAvailable(entitlement) {
      for (let i = 0; i < entitlement.external_product_ids.length; i++) {
        if (entitlement.external_product_ids[i].store === 'stripe') {
          return true
        }
      }
      return false
    },
    selectedPlanIsAvailable(plan) {
      return plan.store === 'stripe'
    },
    filteredEntitlementStripe(external_product_ids) {
      const products = []
      for (let i = 0; i < external_product_ids.length; i++) {
        if (external_product_ids[i].store === 'stripe') {
          products.push(external_product_ids[i])
        }
      }
      return products
    },
    async sendResetPassword() {
      var response = await this.$api.authentications.resetPassword(this.$route.params.id);
      if (response.status < 300) {
        this.$toasted.success("Reset Password Email Sent");
      }
    },
    async addEntitlement(params) {
      const enIdx = this.entitlements.findIndex(item => item.id === params.grant_entitlements)
      const selectedEn = this.entitlements[enIdx]
      const planIdx = selectedEn.attributes.external_product_ids.findIndex(item => item.external_id === params.external_entitlement_id)
      const plan = selectedEn.attributes.external_product_ids[planIdx]
      const data = {
        attributes: {
          cancel: false,
          checkout: true,
          email: this.email,
          external_entitlement_id: params.external_entitlement_id,
          store: plan.store,
          trial_length: params.duration
        },
        id: "id",
        type: "purchase"
      }
      try {
        var response = await this.$api.entitlements.purchase(this.$route.params.id, data)
        if (response.code < 300 || response.status < 300) {
          this.$toasted.success("Subscription Added");
          this.entitlementData.push({
            name: selectedEn.attributes.title,
            store: plan.store,
            external_entitlement_id: params.external_product_id,
            end:  'ongoing'
          })
        } else {
          this.$toasted.error(response.message);
        } 
      } catch(error) {
        console.log(error)
      }
    },
    endDate(receipt) {
      const r = JSON.parse(receipt)
      if (r.cancel_at_period_end) {
        return moment(r.cancel_at * 1000).format('MM-DD-YYYY')
      }
      return undefined
    },
    async cancelSubscription(params) {
      var data = {
        data : {
          id: "id",
          type: "purchase",
          attributes: {
            cancel: true,
            checkout: true,
            email: params.row.email,
            store: params.row.store,
            external_entitlement_id: params.row.external_entitlement_id
          }
        }
      }
      try {
        var response = await this.$api.entitlements.purchase(this.$route.params.id, data)
        if (response.code < 300 || response.status < 300) {
          this.$toasted.success("Subscription Canceled");
          this.entitlementData.forEach((e, i) => {
              if(e.external_entitlement_id == params.row.external_entitlement_id){
                  this.entitlementData.splice(i, 1)
                  return
              }
          })
        } else {
          this.$toasted.error(response.message);
        }
      } catch(error) {
        console.log(error)
      }
    }
  },
  async mounted() {
    this.id = this.$route.params.id;
    if (this.$route.params.id) {
      this.formbuilder.heading = "Update Subscriber";
      this.formbuilder.columns.push(
        {
          label: "Meta",
          field: "meta",
          value: "",
          divtype: true,
          readonly: true,
        },
        {
          groupingtype: true,
          field: "token",
          formbuilder: {
            heading: "",
            columns: [
              {
                label: "Password Reset Token",
                field: "token",
                value: "",
                inputtype: true,
                readonly: true
              }
            ],
            disabledSave: false,
            buttonsavelabel: "Send Reset Password Email",
            action: "send-reset-pw",
            id: "send-reset-pw"
          }
        }
      )
      var response = await this.$api.subscribers.get(this.$route.params.id);
      var data = response.data.data;
      if (data) {
        for (var item in this.formbuilder.columns) {
          var field = this.formbuilder.columns[item].field;
          switch (field) {
            case "meta":
              this.formbuilder.columns[item].value = JSON.stringify(data.meta);
              break;
            case "token":
              this.formbuilder.columns[item].formbuilder.columns[0].value = data.attributes[field];
              break;
            default:
              this.formbuilder.columns[item].value =
                data.attributes[field];
          }
        }
      }
      var transactions = await this.$api.transactions.getSubTransactions(this.$route.params.id);
      transactions.data.data.forEach((e, i) => {
        var end = this.endDate(e.attributes.receipt)
        this.entitlementData.push({
          name: response.data.included[i].attributes.title,
          email: data.attributes.email,
          store: e.attributes.store,
          external_entitlement_id: e.attributes.external_product_id,
          end:  end ? end : 'ongoing'
        })
        this.email = data.attributes.email
      })

      let optionsEntitlements = [];
      let optionsPlans = [];
      optionsPlans[0] = [{
        label: 'Please choose a plan',
        disable: true,
        selected: true,
        hidden: true,
        value: '',
      }];
      const allEntitlements = await this.$api.entitlements.get();
      if (allEntitlements.data) {
        this.entitlements = allEntitlements.data.data
        optionsEntitlements.push({
          label: 'Please choose an entitlement',
          disable: true,
          selected: true,
          hidden: true,
          value: '',
        });
        allEntitlements.data.data.forEach(item => {
          if (this.selectedEntitlementIsAvailable(item.attributes)) {
            optionsEntitlements.push({
              label: item.attributes.title,
              value: item.id
            });
            let includedPlans = [];
            includedPlans.push({
              label: 'Please choose a plan',
              disable: true,
              selected: true,
              hidden: true,
              value: '',
            })
            item.attributes.external_product_ids.forEach(plan => {
              if (this.selectedPlanIsAvailable(plan)) {
                includedPlans.push({
                  label: plan.external_id,
                  value: plan.external_id
                })
              }
            })
            let key = item.id;
            optionsPlans[key] =  includedPlans
          }
        });
      }
      let currentOptionPlans = optionsPlans[this.entitlementIdx]
      this.formbuilder.columns.push(
        {
          tabletype: true,
          field: "transactions",
          props: {
            columns: [
              {
                label: "External Product Id",
                field: "attributes.external_product_id",
                sortable: false
              },
              {
                label: "Store",
                field: "attributes.store",
                sortable: false
              },
              {
                label: "External Customer Id",
                field: "attributes.external_customer_id",
                sortable: false
              },
              {
                label: "External Transaction Id",
                field: "attributes.external_transaction_id",
                sortable: false,
              }
            ],
            norowsfound: "transaction",
            header: "Subscriber's Transactions",
            searchname: "",
            data: transactions.data.data
          }
        },
        {
          tabletype: true,
          field: "subscriptions",
          props: {
            columns: [
              {
                label: "Entitlement",
                field: "name",
                sortable: false
              },
              {
                label: "Store",
                field: "store",
                sortable: false
              },
              {
                label: "Ends",
                field: "end",
                sortable: false
              },
              {
                label: "",
                field: "removebutton",
                sortable: false,
                page: "subscription",
              }
            ],
            norowsfound: "subscription",
            header: "Current Entitlements",
            searchname: "",
            data: this.entitlementData,
            action: this.cancelSubscription
          }
        },
        {
          groupingtype: true,
          field: "subscription",
          formbuilder: {
            heading: "Add Entitlements",
            columns: [
              {
                label: "Grant Entitlements",
                field: "grant_entitlements",
                options: optionsEntitlements,
                booltype: true,
                onchange: (event)=>{
                  this.entitlementIdx = event.target.value
                  currentOptionPlans = optionsPlans[this.entitlementIdx]
                  const idx = this.formbuilder.columns.findIndex(item => item.field === "subscription")
                  const planIdx = this.formbuilder.columns[idx].formbuilder.columns.findIndex(item => item.field === "external_entitlement_id")
                  this.formbuilder.columns[idx].formbuilder.columns[planIdx].options = currentOptionPlans
                  this.formbuilder.columns[idx].formbuilder.columns[planIdx].disabled = !this.entitlementIdx
                }
              },
              {
                label: "Stripe Plan",
                field: "external_entitlement_id",
                options: currentOptionPlans,
                booltype: true,
                disabled: !this.entitlementIdx,
                onchange: (event)=>{
                  this.planIdx = event.target.value
                  currentOptionPlans = optionsPlans[this.planIdx]
                  const idx = this.formbuilder.columns.findIndex(item => item.field === "subscription")
                  const durationIdx = this.formbuilder.columns[idx].formbuilder.columns.findIndex(item => item.field === "duration")
                  this.formbuilder.columns[idx].formbuilder.columns[durationIdx].disable = !this.planIdx
                  this.formbuilder.columns[idx].formbuilder.disbaleSaveBtn = !this.planIdx
                }
              },
              {
                label: "Duration to grant (days)",
                field: "duration",
                value: 0,
                numbertype: true,
                disable: !this.planIdx
              }
            ],
            disabledSave: false,
            disbaleSaveBtn: true,
            buttonsavelabel: "Add",
            action: "add-entitlement",
            id: "add-entitlement"
          }
        },
      )
    } else {
      this.formbuilder.columns.push({
        label: "Password",
        field: "password",
        value: "",
        inputtype: true
      })
    }
  }
};
</script>
