function hasClass(element,className) {
    return !!element.className.match(new RegExp('(\\s|^)'+className+'(\\s|$)'));
}

function removeClass(element, className) {
    if (element && hasClass(element,className)) {
        var reg = new RegExp('(\\s|^)'+className+'(\\s|$)');
        element.className=element.className.replace(reg,'');
    }
}

function addClass(element, className) {
    if (element && !hasClass(element,className)) {
        element.className += ' '+className;
    }
}

function toggleClass(element,className) {
    if(element){
        if(hasClass(element,className)){
            removeClass(element,className);
        }else{
            addClass(element,className);
        }
    }
}