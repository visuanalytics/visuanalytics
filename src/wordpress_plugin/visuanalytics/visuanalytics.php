<?php
/*
Plugin Name: VisuAnalytics
Plugin URI: 
Description: Plugin zum generieren von Videos
Author: 
Author URI: 
Version: 0.1
*/

function add_plugin_scripts() {
  // Load all js files
  $files = glob(plugin_dir_path( __FILE__ ) . "/src/js/*.js");
  
  foreach ($files as $file) {
	  $file_name = basename($file, ".js");
	  $file_url = plugins_url("src/js/" . basename($file), __FILE__);
	
    wp_enqueue_script($file_name, $file_url, array (), '', true);
  }

  wp_enqueue_style("va_css_main", plugins_url("src/css/main.css", __FILE__));
}

add_action( 'admin_enqueue_scripts', 'add_plugin_scripts' );

// add to settings menu
add_action('admin_menu', function () {
  global $visuanalytics_settings_page;
  $icon = plugins_url('images/icon.png', __FILE__)

  $visuanalytics_settings_page = add_menu_page('VisuAnalytics Settings', 'VisuAnalytics', 'manage_options', 'visuanalytics-settings', 'visuanalytics_settings_do_page', $icon);
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