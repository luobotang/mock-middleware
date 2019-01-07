document.querySelector('#J_action1').addEventListener(
  'click',
  function() {
    fetchData('/api/getUserInfo')
  },
  false
)

document.querySelector('#J_action2').addEventListener(
  'click',
  function() {
    fetchData('/getUser')
  },
  false
)

document.querySelector('#J_action3').addEventListener(
  'click',
  function() {
    fetchData('/api/success')
  },
  false
)

document.querySelector('#J_action4').addEventListener(
  'click',
  function() {
    fetchData('/api/error')
  },
  false
)

function fetchData(url) {
  fetch(url)
    .then(res => res.json())
    .then(data => {
      document.querySelector('#output').textContent = JSON.stringify(data, null, '  ')
    })
}
