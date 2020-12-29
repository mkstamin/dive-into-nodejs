window.onload = function () {
    const bookmarks = document.getElementsByClassName('bookmark');
    [...bookmarks].forEach((bookmark) => {
        bookmark.style.cursor = 'pointer';
    });
};
