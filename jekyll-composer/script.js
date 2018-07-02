import {Compose} from "./compose.js/compose.js";

$(document).ready(async ()=>{
	console.log('Hello');
	const simMDE = new SimpleMDE({
		element: $('#content textarea')[0],
		renderingConfig: {
			codeSyntaxHighlighting: true
		}
	});

	const composer = new Compose();
	await composer.init();
	composer.addTreeView($('#tree-view')[0]);
	composer.addMDE(simMDE);
	

	document.addEventListener('keydown', (e)=>{
		if (e.ctrlKey && e.key == 's')
		{
			e.preventDefault();
			composer.update();
			composer.save();
		}
	});

	$("#compose").on('click', ()=>{
		if (prompt('Are you sure!')) {
			composer.compose();
		}
	});
});