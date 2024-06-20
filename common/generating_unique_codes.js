
export const RandomCodeGenerator = (remainingChars, argPrefix = 'aaa') => {
    const generatedCodes = new Set();
    let prefix = argPrefix;
    const letters = "abcdefghijklmnopqrstuvwxyz";
    const digits = "0123456789";

    while (true) {
        let availableChars = [...letters, ...digits];
        const randomChars = [];
        let ditigCount = 0;

        while (remainingChars > 0) {
            const randomIndex = Math.floor(Math.random() * availableChars.length);
            const char = availableChars[randomIndex];

            if (!isNaN(char)) {
                ditigCount++;
                if (ditigCount > 3) continue;

                randomChars.splice(Math.floor(Math.random() * randomChars.length), 0, char);
            }
            else if (ditigCount === 0 && remainingChars <= 1) {
                continue
            } else {
                randomChars.push(char);
            }

            availableChars.splice(randomIndex, 1);
            remainingChars--;
        }
        const code = prefix + randomChars.join("");
        if (!generatedCodes.has(code)) {
            generatedCodes.add(code);
            return code.toUpperCase();
        }

        if (availableChars.length === 0) {
            prefix = incrementPrefix(prefix);
        }
    }
}

const incrementPrefix = (prefix) => {
    const lastCharCode = prefix.charCodeAt(2) + 1;
    if (lastCharCode <= 122) {
        return prefix.slice(0, 2) + String.fromCharCode(lastCharCode);
    } else {
        const secondCharCode = prefix.charCodeAt(1) + 1;
        if (secondCharCode <= 122) {
            return prefix[0] + String.fromCharCode(secondCharCode) + 'a';
        } else {
            return String.fromCharCode(prefix.charCodeAt(0) + 1) + "aa";
        }
    }
}