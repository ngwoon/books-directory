function onDocumentBtnClick(title, type) {
    const oTitle = title.split('')[0];
    const action = "http://localhost:3000/document?title=".concat(oTitle,"&type=",type);
    
    const form = document.forms['docForm'];
    form.action = action;
    console.log(form.action);
    form.submit();
}