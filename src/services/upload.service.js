export const uploadService = {
  uploadImg
}
function uploadImg(ev) {
  const CLOUD_NAME = "noambar"
  const UPLOAD_PRESET = "iqikctdx"
  const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

  const formData = new FormData();
  formData.append('upload_preset', UPLOAD_PRESET);
  
  
  if (typeof (ev) === 'string') {
    formData.append('folder', 'Mellofy/Songs Pics');
    formData.append('file', ev)
  }
  else{
    formData.append('file', ev.target.files[0])
  }

  // formData.append('folder', 'Mellofy/Songs Pics');
  // formData.append('file', ev.target.files[0])

  return fetch(UPLOAD_URL, {
    method: 'POST',
    body: formData,
  })
    .then(res => res.json())
    .then(res => {
      return res
    })
    .catch(err => console.error(err))
}
