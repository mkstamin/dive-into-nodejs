window.onload = function () {
    const likeBtn = document.getElementById('likeBtn');
    const dislikeBtn = document.getElementById('dislikeBtn');

    likeBtn.addEventListener('click', () => {
        const postId = likeBtn.dataset.post;
        reqLikeDislike('likes', postId)
            .then((res) => res.json())
            .then((data) => {
                let likeText = data.liked ? 'Liked' : 'Like';
                likeText += ` ( ${data.totalLikes} )`;
                const dislikeText = `Dislike ( ${data.totalDisLikes} )`;

                likeBtn.innerHTML = likeText;
                dislikeBtn.innerHTML = dislikeText;
            })
            .catch((e) => {
                console.log(e);
                alert(e.respose.data.error);
            });
    });

    dislikeBtn.addEventListener('click', () => {
        const postId = likeBtn.dataset.post;
        reqLikeDislike('dislikes', postId)
            .then((res) => res.json())
            .then((data) => {
                let dislikeText = data.disliked ? 'Disliked' : 'Dislike';
                dislikeText += ` ( ${data.totalDisLikes} )`;
                const likeText = `Like ( ${data.totalLikes} )`;

                likeBtn.innerHTML = likeText;
                dislikeBtn.innerHTML = dislikeText;
            })
            .catch((e) => {
                console.log(e);
                alert(e.respose.data.error);
            });
    });

    function reqLikeDislike(type, postId) {
        const headers = new Headers();
        headers.append('Accept', 'Application/JSON');
        headers.append('Content-Type', 'Application/JSON');

        const req = new Request(`/api/${type}/${postId}`, {
            method: 'GET',
            headers,
            mode: 'cors',
        });

        return fetch(req);
    }
};
