document.addEventListener('DOMContentLoaded', () => {
    const sectionSelector = document.getElementById('sectionSelector');
    const citationInput = document.getElementById('citationInput');
    const searchButton = document.getElementById('searchButton');
    const citationDisplay = document.getElementById('citationDisplay');

    searchButton.addEventListener('click', () => {
        const section = sectionSelector.value;
        let citationId = citationInput.value;

        citationDisplay.innerHTML = '';

        citationId = parseInt(citationId, 10);
        if (isNaN(citationId) || citationId <= 0) {
            citationInput.style.borderColor = 'red';
            citationDisplay.innerHTML = '<p class="error">Número de Cita no encontrado.</p>';
            return;
        }

        citationInput.style.borderColor = '';

        citationDisplay.innerHTML = '<p class="loading">Cargando...</p>';

        fetch(`${section}.html`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('No se pudo cargar la sección.');
                }
                return response.text();
            })
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const citations = doc.querySelectorAll(`.cita[id="${citationId}"]`); // Usar querySelectorAll

                citationDisplay.innerHTML = '';

                if (citations.length > 0) { // Comprobar si se encontraron citas
                    citations.forEach(citation => { // Iterar sobre todas las citas encontradas
                        citationDisplay.appendChild(citation.cloneNode(true));
                    });
                } else {
                    citationDisplay.innerHTML = '<p class="error">Cita no encontrada.</p>';
                }
            })
            .catch(error => {
                citationDisplay.innerHTML = `<p class="error">Error: ${error.message}</p>`;
            });
    });
});
