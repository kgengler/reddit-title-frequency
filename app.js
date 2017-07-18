(function($) {
    $cloud = $('#containercloud').jQCloud().addClass('hidden');
    $loading = $('.loading').addClass('hidden');
    $error = $('.container-error').addClass('hidden');

    $("#formsubreddit").submit(function(event) {
        event.preventDefault();
        
        var form = event.target;
        var subreddit = form.elements["subreddit"].value;

        $loading.removeClass('hidden');
        $cloud.addClass('hidden');
        $error.addClass('hidden');

        request = $.ajax({
            url: 'https://u0uehx49d3.execute-api.us-west-2.amazonaws.com/prod/frequency',
            data: { subreddit: subreddit },
            dataType: "json"
        }).done(function(data) {
            var wordCounts = JSON.parse(data.body);
            var mappedArray = [];

            for (var i = 0, word; i < wordCounts.length; i++) {
                word = wordCounts[i];
                mappedArray.push({ text: word[0], weight: word[1] });
            }

            $cloud.removeClass('hidden');
            $cloud.jQCloud('update', mappedArray);

        }).fail(function(xhr, status, error) {
            console.error(status + ": " + error);
            $error.removeClass('hidden');
        }).always(function() {
            $loading.addClass('hidden');
        });
    });
})(jQuery);

