function getContent() {
    const textArea = document.querySelector(".js-textarea");
    let content = textArea.value;

    // content = content.replace("<textarea>", "");
    // content = content.replace("</textarea>", "");
    content = content.trim();

    return content;
}

function onUpdateBtnClicked(event) {
    event.preventDefault();

    const content = getContent();

    // 변경사항이 없으면 반응하지 않는다.
    if(content.localeCompare(originalContent) === 0)
        return false;
    else {
        const form = document.querySelector(".js-update-form");
        form.action = "/document/edit";
        form.submit();
    }
}

function init() {
    const editBtn = document.querySelector(".js-edit-button");
    
    // 편집 가능한 상태. 즉, 로그인된 상태일 때
    if(editBtn)
        originalContent = getContent();

    const form = document.querySelector(".js-update-form");
    form.onsubmit = onUpdateBtnClicked;
}


let originalContent;
init();