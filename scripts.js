document.addEventListener('DOMContentLoaded', () => {
    const enrollBtn = document.getElementById('enrollBtn');
    const trainingForm = document.getElementById('trainingForm');

    if (enrollBtn && trainingForm) {
        enrollBtn.addEventListener('click', () => {
            trainingForm.style.display = 'block';
        });

        const form = trainingForm.querySelector('form');
        if (form) {
            form.addEventListener('submit', async (event) => {
                event.preventDefault();

                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const courseType = document.getElementById('courseType').value;

                const formData = { name, email, courseType };

                try {
                    const response = await fetch('/enroll', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(formData),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
                    }

                    const data = await response.json();
                    console.log('Success:', data);
                    alert('Enrollment successful!');
                    trainingForm.style.display = 'none';
                    form.reset();
                } catch (error) {
                    console.error('Error:', error);
                    alert(`An error occurred: ${error.message || 'Please try again.'}`);
                }
            });
        }
    }
});