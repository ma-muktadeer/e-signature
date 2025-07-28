
export function blockToCamel(value: string) {

    if (value && (value != null && value != 'null')) {
        try {
            const words = value.split(/_| /g);
            const camelCaseWords = words.map((word, index) => index < 0 ? word : word.charAt(0) + word.slice(1).toLowerCase());
            const sts = camelCaseWords.join(' ');
            return sts == 'In Active' ? 'Inactive' : sts == 'Canceled' ? 'Cancelled' : sts;;
        } catch (error) {
            console.log('can not convert: ', value);
            return value;
        }
    } else {
        return '';
    }

}

// export function validatePassword(password: string) {
//     if (!password) {
//         return false;
//     }
//     const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\[\]{}|;:,.<>?])(?!.*(.)\1{3})[A-Za-z\d!@#$%^&*()_+\[\]{}|;:,.<>?]{10,15}$/;
//     return passwordPattern.test(password);
// }

export function validatePassword(password: string): boolean | any {
    if (!password) {
        return {
            length: false,
            uppercase: false,
            lowercase: false,
            digit: false,
            specialCharacter: false,
            successive: false,
            isValid: false
        };
    }

    let res = [
        { name: 'length', value: /^.{12,15}$/ },
        { name: 'uppercase', value: /[A-Z]/ },
        { name: 'lowercase', value: /[a-z]/ },
        { name: 'digit', value: /\d/ },
        { name: 'specialCharacter', value: /[!@#$%^&*()?]/ },
        { name: 'successive', value: /(.)\1{4}/, negate: true }
    ];

    let result = {};
    let isValid = true;

    res.forEach(pattern => {
        const isMatch = pattern.value.test(password);
        const finalResult = pattern.negate ? !isMatch : isMatch;
        result[pattern.name] = finalResult;
        if (!finalResult) {
            isValid = false;
        }
    });
    if (!isValid) {
        return { ...result, isValid };
    }
    else {
        return true;
    }
}

export function checkNullValue(value: string): string {
    if (value) {
        return value;
    }
    return '';
}



export function detectDevTools() {
    let devtools = {
        open: false,
        orientation: null
    };
    const threshold = 160;
    const emitEvent = (isOpen: boolean, orientation: string | null) => {
        window.dispatchEvent(new CustomEvent('devtoolschange', {
            detail: {
                open: isOpen,
                orientation: orientation
            }
        }));
    };
    const checkDevTools = () => {
        const widthThreshold = window.outerWidth - window.innerWidth > threshold;
        const heightThreshold = window.outerHeight - window.innerHeight > threshold;
        const orientation = widthThreshold ? 'vertical' : 'horizontal';

        if (!(heightThreshold && widthThreshold) &&
            ((window as any).Firebug && (window as any).Firebug.chrome && (window as any).Firebug.chrome.isInitialized || widthThreshold || heightThreshold)) {
            if (!devtools.open || devtools.orientation !== orientation) {
                emitEvent(true, orientation);
            }
            devtools.open = true;
            devtools.orientation = orientation;
        } else {
            if (devtools.open) {
                emitEvent(false, null);
                // Reload the page when devtools are closed
                location.reload();
            }
            devtools.open = false;
            devtools.orientation = null;
        }
    };

    // Initial check when the function is called
    checkDevTools();

    // Periodically check for changes in devtools state
    setInterval(checkDevTools, 500);

    // Listen for devtoolschange event
    window.addEventListener('devtoolschange', (event: any) => {
        if (event.detail.open) {
            document.body.innerHTML = 'In Production Mode Inspect is not allowed.';
            // Or take some other action, like redirecting the user
            // window.location.href = "someotherpage.html";
        } else {
            document.body.innerHTML = 'In Production Mode Inspect is not allowed.';
            // Reload the page when devtools are closed
            location.reload();
        }
    });
}
