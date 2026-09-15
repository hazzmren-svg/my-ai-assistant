// Stream Markdown Text
async function streamText(markdownElement, text, speed = 12) {

    let current = "";

    for (let i = 0; i < text.length; i++) {

        current += text[i];

        markdownElement.innerHTML = marked.parse(current);

        chat.scrollTop = chat.scrollHeight;

        await new Promise(resolve => setTimeout(resolve, speed));

    }

}