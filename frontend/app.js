document.getElementById("searchForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const imageInput = document.getElementById("imageInput");
    const file = imageInput.files[0];
    if (!file) {
        alert("이미지를 선택해주세요.");
        return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
        const response = await fetch("https://34.64.235.196:8081/search", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error("이미지 검색 중 오류가 발생했습니다.");
        }

        const results = await response.json();
        displayResults(results);

    } catch (error) {
        alert(error.message);
        console.error("검색 오류:", error);
    }
});

function displayResults(results) {
    const resultsList = document.getElementById("resultsList");
    resultsList.innerHTML = "";

    if (results.length === 0) {
        resultsList.innerHTML = "<li>검색 결과가 없습니다.</li>";
        return;
    }

    results.forEach(result => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <strong>${result.productName}</strong><br>
            가격: ${result.price}<br>
            <a href="${result.link}" target="_blank">구매 페이지로 이동</a>
        `;
        resultsList.appendChild(listItem);
    });
}
