window.onload = function () {
    tinymce.init({
        selector: '#tiny-mc-post-body',
        plugins: [
            'advlist lists link autolink autosave code',
            'preview',
            'searchreplace',
            'wordcount',
            'media table emoticons image imagetools',
        ],
        toolbar:
            'bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media | forecolor backcolor emoticons | code preview',
        height: 300,
        automatic_uploads: true,
        images_upload_url: '/uploads/postimage',
        relative_urls: false,
        images_upload_handler(blobInfo, success, failure) {
            const headers = new Headers();
            headers.append('Accept', 'Application/JSON');

            const formData = new FormData();
            formData.append('post-image', blobInfo.blob(), blobInfo.filename());

            const req = new Request('/uploads/postimage', {
                method: 'POST',
                headers,
                mode: 'cors',
                body: formData,
            });

            fetch(req)
                .then((res) => res.json())
                .then((data) => success(data.imgUrl))
                .catch(() => failure('HTTP Error'));
        },
    });
};
