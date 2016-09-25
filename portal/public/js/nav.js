var toggle = document.getElementsByClassName('nav-toggle')[0];
toggle.onclick = function () {
    toggleClass(document.body, 'mini');
    return false;
};
