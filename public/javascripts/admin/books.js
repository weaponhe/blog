$('#btnSava').click(function() {
	$('#newBookModal').modal("hide");
});

$('#newBookModal').on('hidden.bs.modal', function(e) {
	location.hash = "#nav:books,method:post";
});