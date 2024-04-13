/**
 * This function uses jQuery to find and modify specific text within paragraphs.
 * It replaces occurrences of "Developer Akademie GmbH," "Developer Akademie," and "Join" 
 * with the same text enclosed in <span> tags, applying color and font size styling.
 */
$(document).ready(function () {
    $("p:contains('Developer Akademie GmbH'), p:contains('Developer Akademie'), p:contains('Join')").each(function () {
        $(this).html(
            $(this).html()
                .replace(/\bDeveloper Akademie GmbH\b/g, '<span style="color: #4589FF; font-size: 16px;">Developer Akademie GmbH</span>')
                .replace(/\bDeveloper Akademie\b/g, '<span style="color: #4589FF; font-size: 16px;">Developer Akademie</span>')
                .replace(/\bJoin\b/g, '<span style="color: #4589FF; font-size: 16px;">Join</span>')
        );
    });
});