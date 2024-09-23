<script lang="ts">
	import { receiveSessionDetails } from '$lib/forms/service/stores/session';

	export let data;
	receiveSessionDetails(data);

	console.log(data);

	/*
  - Si existe token
    - No ha terminado el form
      - No lo ha terminado, el wey
  - No existe
    - Ya terminó pa

-------------------------------------------

  - Mostrar las listas de las respuestas
  */
</script>

{#if data.sessionDetails.token}
	<p>No ha terminado</p>
{:else}
	<p>Ya terminó el questionario</p>
{/if}

<h2>Answers</h2>
{#each data.sessionDetails.answers as answer}
	<h4>{data.questions.find((question) => question.id === answer.question_id).title}</h4>
	{#if answer.data}
		<li>{answer.data}</li>
	{:else}
		<li>No answer</li>
	{/if}
{/each}
