import moment from 'moment'

export const response = {
  error(data) {
    var errMsg = {};
    if (data.response) {
      var res = data.response.data.errors[0];
      errMsg.message = res.detail;
      errMsg.status = res.code;
    } else if (data.errors[0]) {
      errMsg.message = data.errors[0].detail;
      errMsg.status = data.errors[0].code;
    } else {
      errMsg = data
    }
    return errMsg;
  }
};
export const fileDownload = (response, filename) => {
  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', moment().format("MM/DD/YYYY hh:mm:ss") + '_' + filename + '.csv')
  document.body.appendChild(link)
  link.click()
};
