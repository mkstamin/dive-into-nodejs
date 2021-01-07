/* eslint-disable no-alert */
/* eslint-disable no-param-reassign */
/* eslint-disable func-names */
/* eslint-disable no-undef */
window.onload = function () {
    const bookmarks = document.getElementsByClassName('bookmark');
    [...bookmarks].forEach((bookmark) => {
        bookmark.style.cursor = 'pointer';
        bookmark.addEventListener('click', (e) => {
            const target = e.target.parentElement;

            console.dir(target.dataset.post);

            const headers = new Headers();
            headers.append('Accept', 'Application/JSON');

            const req = new Request(`/api/bookmarks/${target.dataset.post}`, {
                method: 'GET',
                headers,
                mode: 'cors',
            });

            console.log(req);

            fetch(req)
                .then((res) => res.json())
                .then((data) => {
                    if (data.bookmark) {
                        target.innerHTML = '<i class="fas fa-bookmark"></i>';
                    } else {
                        target.innerHTML = '<i class="far fa-bookmark"></i>';
                    }
                })
                .catch((e) => {
                    console.error(e.response.data);
                    alert(e.response.data.error);
                });
        });
    });
};
