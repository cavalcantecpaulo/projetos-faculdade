
const links = document.querySelectorAll('.links');

if (links.length > 0) { 
    links.forEach(link => {
        link.addEventListener('click', function () {
            links.forEach(item => item.classList.remove('ativo')); 
            this.classList.add('ativo'); 
        });
    });

    document.addEventListener("DOMContentLoaded", () => {
        const currentPath = window.location.pathname.split('/').pop(); 

        links.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (linkHref && linkHref.includes(currentPath)) {
                link.classList.add('ativo');
            } else {
                link.classList.remove('ativo'); 
            }
        });
    });
}