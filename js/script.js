const start = () => {
    const openMenuBtn = document.querySelector(".header__menu-btn");
    const menu = document.querySelector(".menu");
    const closeMenuBtn = document.querySelector(".menu__close-btn");
    const videoEl = document.querySelector(".video__bg");

    const toggleMenu = () => menu.classList.toggle("menu--active");
    const insertVideo = e => {
        const element = e.currentTarget;
        const parent = element.parentNode;
        const url = element.dataset.src;
        element.remove();
        parent.insertAdjacentHTML('beforeend', `
        <iframe height="620" src=${url} style="width: 100%;"
                    title="YouTube video player" frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen></iframe>
    `);


    }

    openMenuBtn?.addEventListener('click', toggleMenu);
    closeMenuBtn?.addEventListener('click', toggleMenu);
    videoEl?.addEventListener('click', insertVideo);

    const swiper = new Swiper('.finished-works__swiper', {
        slidesPerView: 3,
        slidesPerGroup: 3,
        spaceBetween: 30,
        pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
            clickable: true
        },
        breakpoints: {
            320: {
                slidesPerView: 1,
                slidesPerGroup: 1,
            },
            768: {
                slidesPerView: 2,
                slidesPerGroup: 2,
            },
            992: {
                slidesPerView: 3,
                slidesPerGroup: 3,
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", start);



