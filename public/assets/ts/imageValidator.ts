export function validateImageIs4k(file: File): Promise<HTMLImageElement | undefined> {
  return new Promise<HTMLImageElement | undefined>((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      if (img.width >= 3840 && img.height >= 2160 && inRange(img.width / img.height, 16.0 / 9.0, 0.05)) {
        resolve(img)
      } else {
        reject(new Error('invalid image dimensions'))
      }
    }
    const reader = new FileReader()

    reader.addEventListener('load', () => {
      img.src = reader.result.toString()
    })
    reader.readAsDataURL(file)
  })
}

function inRange(actual: number, target: number, tolerance: number) {
  return Math.abs(actual - target) <= tolerance
}
