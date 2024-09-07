<script>
	import { receiveNavbar } from '$lib/presentation/NavBar';
	import { receiveForms } from '$lib/forms/service/stores';

	export let data;

	receiveNavbar(data);
	receiveForms(data);
</script>

<slot />
