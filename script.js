document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('searchForm');
    const sectionSelector = document.getElementById('sectionSelector');
    const citationInput = document.getElementById('citationInput');
    const citationDisplay = document.getElementById('citationDisplay');
    const subtitulo = document.getElementById('subtitulo');

    // Manejador de envío del formulario
    searchForm.addEventListener('submit', handleSearch);

    // Actualización del selector de sección
    sectionSelector.addEventListener('change', () => {
        const citationId = citationInput.value.trim();
        if (citationId) handleSearch(); // Llamar a la búsqueda si hay un número
    });

    function handleSearch(event) {
        if (event) event.preventDefault(); // Prevenir envío tradicional
        const section = sectionSelector.value;
        const citationId = citationInput.value.trim();

        // Validaciones
        if (!citationId || isNaN(citationId) || citationId < 1 || citationId > 1539) {
            citationInput.style.borderColor = 'red';
            citationDisplay.innerHTML = '<p class="error">Número de cita no válido. Debe estar entre 1 y 1539.</p>';
            return;
        }

        // Restablecer estilos
        citationInput.style.borderColor = '';

        // Ocultar subtítulo si existe
        if (subtitulo) subtitulo.style.display = 'none';

        // Mostrar mensaje de carga
        citationDisplay.innerHTML = '<p class="loading">Cargando...</p>';

        // Cargar citas
        fetch(`${section}.html`)
            .then(response => {
                if (!response.ok) throw new Error('No se pudo cargar la Cita.');
                return response.text();
            })
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const citations = doc.querySelectorAll(`.cita[id="${citationId}"]`);

                citationDisplay.innerHTML = ''; // Limpiar mensaje de carga

                if (citations.length > 0) {
                    citations.forEach(citation => {
                        citationDisplay.appendChild(citation.cloneNode(true));
                    });
                } else {
                    citationDisplay.innerHTML = '<p class="error">Cita no encontrada.</p>';
                }
            })
            .catch(error => {
                citationDisplay.innerHTML = `<p class="error">Error: ${error.message}</p>`;
            });
    }
});
