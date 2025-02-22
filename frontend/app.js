fetch('http://localhost:8081/api/data')  // 백엔드 API 호출 예시
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));