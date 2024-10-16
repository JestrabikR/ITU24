<script>
import { onNavigate } from '$app/navigation';

// does not seem to work on Firefox (view transition API)
onNavigate((navigation) => {
	if (!document.startViewTransition) return;

	return new Promise((resolve) => {
		document.startViewTransition(async () => {
			resolve();
			await navigation.complete;
		});
	});
});
</script>

<slot />

