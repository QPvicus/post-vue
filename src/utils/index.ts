import { ElMessage } from 'element-plus'

export function isMobile(mobile: string) {
  return /^1[3-9]\d{9}$/.test(mobile)
}

interface CheckCondition {
  format?: string[]
  size?: number
}

type ErrorType = 'size' | 'format' | null

export function beforeUploadCheck(file: File, condition: CheckCondition) {
  const { size, format } = condition
  const isValidFormat = format ? format.includes(file.type) : true
  const isValidSize = size ? file.size / 1024 / 1024 < size : true
  let error: ErrorType = null
  if (!isValidFormat) {
    error = 'format'
  }
  if (!isValidSize) error = 'size'
  return {
    passed: isValidFormat && isValidSize,
    error
  }
}

export function commonUploadCheck(file: File) {
  const result = beforeUploadCheck(file, {
    format: ['image/jpeg', 'image/png', 'image/jpg'],
    size: 1
  })
  const { passed, error } = result
  if (error == 'format') {
    ElMessage({
      type: 'error',
      message: '上传图片只能是 JPG/PNG 格式'
    })
  }
  if (error == 'size') {
    ElMessage({
      type: 'error',
      message: '上传图片大小不能超过 1Mb'
    })
  }
  return passed
}

export function imageDimensions(file: File) {
  return new Promise<{ width: number; height: number }>((resolve, reject) => {
    const img = new Image()
    img.src = URL.createObjectURL(file)
    img.onload = () => {
      const { naturalWidth: width, naturalHeight: height } = img
      resolve({ width, height })
    }

    img.onerror = () => {
      reject(new Error('There was some problem with the image.'))
    }
  })
}

export function insertAt(arr: any[], index: number, newItem: any) {
  return [...arr.slice(0, index), newItem, ...arr.slice(index)]
}

export function clickInsideElement(e: Event, className: string) {
  let el = e.target as HTMLElement
  if (el.classList.contains(className)) {
    return el
  } else {
    while (el) {
      if (el.classList && el.classList.contains(className)) {
        return el
      } else {
        el = el.parentNode as HTMLElement
      }
    }
  }
  return false
}
