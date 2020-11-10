function getContent() {
    const textArea = document.querySelector(".js-textarea");
    let content = textArea.value;
    content = content.trim();

    return content;
}

function initUpdateRequest() {
    $(".js-update-form").submit(function(event) {
        event.preventDefault();
        
        if(event.originalEvent.submitter === $(".js-delete-button"))
            return false;

        const content = getContent();

        // 변경사항이 없으면 반응하지 않는다.
        if(content.localeCompare(originalContent) === 0)
            return false;
        else {
            console.log(document.location.href);
            const url = "/documents/document";
            const type = "post";
            const formData = $(this).serialize();
            $.ajax({
                url,
                type,
                data: formData,
            }).done(function(response) {
                alert("업데이트 완료");
            });
        }
    });  
}

function initDeleteRequest() {
    const deleteBtn = document.querySelector(".js-delete-button");
}


function init() {
    const updateBtn = document.querySelector(".js-update-button");
    
    // 편집 가능한 상태. 즉, 로그인된 상태일 때
    if(updateBtn)
        originalContent = getContent();

    initUpdateRequest();
    initDeleteRequest();
}

let originalContent;
init();