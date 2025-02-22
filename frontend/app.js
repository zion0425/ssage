document.getElementById('searchForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const imageInput = document.getElementById('imageInput');
    const resultsContainer = document.getElementById('results');
    
    if (!imageInput.files.length) {
        alert('이미지를 업로드해주세요!');
        return;
    }

    resultsContainer.innerHTML = '<p>검색 중...</p>';
    
    // 샘플 데이터
    const sampleResults = [
        { imageUrl: 'https://via.placeholder.com/150', link: 'https://example.com', price: '₩10,000' },
        { imageUrl: 'https://via.placeholder.com/150', link: 'https://example.com', price: '₩8,000' },
        { imageUrl: 'https://via.placeholder.com/150', link: 'https://example.com', price: '₩12,000' }
    ];

    setTimeout(() => {
        resultsContainer.innerHTML = '';
        sampleResults.sort((a, b) => parseInt(a.price.replace(/[^0-9]/g, '')) - parseInt(b.price.replace(/[^0-9]/g, '')));
        sampleResults.forEach(result => {
            const item = document.createElement('div');
            item.className = 'result-item';
            item.innerHTML = `
                <img src="${result.imageUrl}" alt="상품 이미지" />
                <p>${result.price}</p>
                <a href="${result.link}" target="_blank">상품 페이지로 이동</a>
            `;
            resultsContainer.appendChild(item);
        });
    }, 1000);
});
