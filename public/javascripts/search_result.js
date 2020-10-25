function onDocumentClicked(file) {
    const currentURL = document.location.href;
    const nextURL = currentURL + "?file=" + file;
    location.href = nextURL;
}