// --- CẤU HÌNH ---
// DÁN LINK FORMSPREE CỦA DU VÀO ĐÂY
const FORMSPREE_ENDPOINT = "https://formspree.io/f/mrbnrbev";


// --- LOGIC ---
let dateData = {
    email: "",
    time: "",
    food: "",
    dessert: "",
    activity: ""
};

function showScene(sceneNumber) {
    document.querySelectorAll('.scene').forEach(scene => {
        scene.classList.remove('active');
    });
    document.getElementById('scene-' + sceneNumber).classList.add('active');
}

function nextScene(number) {
    showScene(number);
}

function saveTimeAndNext() {
    const timeInput = document.getElementById('date-time').value;
    if (!timeInput) { alert("Hãy chọn thời gian nhé!"); return; }
    dateData.time = timeInput;
    nextScene(3);
}

function saveEmailAndNext() {
    const emailInput = document.getElementById('email-input').value;
    if (!emailInput) { alert("Hãy nhập email nhé!"); return; }
    dateData.email = emailInput;
    nextScene(2);
}

function selectCard(cardElement, category, value) {
    const parent = cardElement.parentElement;
    const siblings = parent.querySelectorAll('.card');
    siblings.forEach(el => el.classList.remove('selected'));

    cardElement.classList.add('selected');
    dateData[category] = value;
}

function checkSelectionAndNext(category, nextSceneNum) {
    if (!dateData[category]) {
        alert("Em chưa chọn món nào kìa! 🥺");
        return;
    }

    if (nextSceneNum === 6) {
        displayResult();
    }

    nextScene(nextSceneNum);
}

function displayResult() {
    const resultString =
        // `Email: ${dateData.email}\n` +
        `Thời gian: ${dateData.time}\n` +
        `Món chính: ${dateData.food}\n` +
        `Tráng miệng: ${dateData.dessert}\n` +
        `Hoạt động sau ăn: ${dateData.activity}`;
    document.getElementById('result-text').value = resultString;
}

// --- HÀM NÚT CHẠY TRỐN (Đã Fix) ---
// Nhận thêm tham số 'e' (event) để xử lý chính xác
function moveButton(btn, e) {
    // Kiểm tra nếu sự kiện là 'touchstart' (chạm màn hình điện thoại)
    // Hoặc kiểm tra window.event nếu e không được truyền (fallback)
    const currentEvent = e || window.event;
    
    if (currentEvent && currentEvent.type === 'touchstart') {
        currentEvent.preventDefault(); // Chặn hành động click/tap mặc định
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    const btnWidth = btn.offsetWidth;
    const btnHeight = btn.offsetHeight;

    const newLeft = Math.random() * (width - btnWidth - 20);
    const newTop = Math.random() * (height - btnHeight - 20);

    btn.style.position = 'fixed'; 
    btn.style.left = newLeft + 'px';
    btn.style.top = newTop + 'px';
}

// --- HÀM GỬI DỮ LIỆU ---
function sendDataToFormspree() {
    const btn = document.getElementById('btn-send');
    const errorMsg = document.getElementById('error-message');
    const content = document.getElementById('email-input').value + 
        document.getElementById('result-text').value +
        "\n\nLời nhắn từ em:\n" +
        document.getElementById('message-text').value;

    if (FORMSPREE_ENDPOINT.includes("DÁN_MÃ")) {
        alert("Bạn chưa dán link Formspree vào code kìa!");
        return;
    }

    btn.innerHTML = "Đang gửi...";
    btn.disabled = true;
    errorMsg.innerHTML = "";

    fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: content,
            _subject: "Kèo hẹn hò chốt đơn!"
        })
    })
        .then(response => {
            if (response.ok) {
                nextScene(7);
            } else {
                errorMsg.innerHTML = "Lỗi server, vui lòng thử lại.";
                btn.innerHTML = "Thử lại";
                btn.disabled = false;
            }
        })
        .catch(error => {
            errorMsg.innerHTML = "Lỗi mạng rồi :(";
            btn.innerHTML = "Thử lại";
            btn.disabled = false;
        });
}