const form = document.getElementById("feedbackForm");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const comentario = document.getElementById("feedback").value;
  const avaliacao_estrelas = document.querySelector(
    'input[name="rating"]:checked'
  )?.value;

//   if (!comentario || !avaliacao_estrelas) {
//     alert("Por favor, forneça comentário e avaliação em estrelas!");
//     return;
//   }

  const feedbackData = {
    comentario: comentario,
    avaliacao_estrelas: +avaliacao_estrelas,
  };

  try {
    const response = await fetch("http://localhost:3000/api/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(feedbackData),
    });

    if (response.ok) {
      const result = await response.json();
      alert("Feedback enviado com sucesso!");
      console.log(result);
      form.reset();
      window.location.href = "./index.html"; 
    } else {
      const error = await response.json();
      console.error(error);
      alert("Erro ao enviar feedback: " + error.mensagem);
    }
  } catch (error) {
    console.error("Erro na solicitação:", error);
    alert("Erro ao enviar feedback. Tente novamente mais tarde.");
  }
});
