<?php
/*
Plugin Name: VisuAnalytics
Plugin URI: 
Description: Plugin zu generieren von Videos
Author: 
Author URI: 
Version: 0.1
*/

function add_theme_scripts() {
  wp_enqueue_script( '2.4de98020.chunk', '/wp-content/plugins/visuanalytics/src/2.4de98020.chunk.js', array (), '', true);
  wp_enqueue_script( 'main.cc0add7f.chunk', '/wp-content/plugins/visuanalytics/src/main.cc0add7f.chunk.js', array (), '', true);
  wp_enqueue_script( 'runtime-main.7f8671c6', '/wp-content/plugins/visuanalytics/src/runtime-main.7f8671c6.js', array (), '', true);
}
add_action( 'admin_enqueue_scripts', 'add_theme_scripts' );

// add to settings menu
add_action('admin_menu', function () {
  global $visuanalytics_settings_page;
  $visuanalytics_settings_page = add_menu_page('VisuAnalytics Settings', 'VisuAnalytics', 'manage_options', 'visuanalytics-settings', 'visuanalytics_settings_do_page');
  // Draw the menu page itself
  function visuanalytics_settings_do_page() {
    ?>
        <div id="root" style='margin-left: -20px;'></div>
	<?php
  }

  // add link to settings on plugin page (next to "Deactivate")
  add_filter('plugin_action_links_' . plugin_basename(__FILE__), function ($links) {
    $settings_link = '<a href="options-general.php?page=visuanalytics-settings">' . __( 'Settings' ) . '</a>';
    array_unshift($links, $settings_link);
    return $links;
  });
});