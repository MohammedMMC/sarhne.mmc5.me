function selectImages(button) {
    let input = document.querySelector('input#images');
    input.value = "";
    input.click();
    input.addEventListener("change", next);
    async function next() {
        input.removeEventListener("change", next);
        button.innerText = `${[...input.files].length} ${[...input.files].length > 1 ? "صور" : "صورة"}`;
    }
}
async function sendMessage() {
    let msgToSend = document.querySelector("#message").value;
    let images = [...document.querySelector("#images").files];
    if (!msgToSend) return new message({ text: "يجب عليك كتابة رسالة قبل الأرسال!", icon: "error" });
    let fromdata = new FormData();
    fromdata.append("message", msgToSend);
    if (images[0]) {
        images.forEach((image, i) => {
            fromdata.append(`image${i + 1}`, image);
        });
    }
    let res = await fetch("/message", {
        method: "POST",
        body: fromdata
    });
    Swal.fire({
        ...(await res.json()),
        confirmButtonText: 'تم',
    }).then(() => {
        window.location.reload();
    });
}