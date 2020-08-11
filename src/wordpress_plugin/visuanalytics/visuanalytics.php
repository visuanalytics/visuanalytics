<?php
/*
Plugin Name: VisuAnalytics
Plugin URI: https://github.com/SWTP-SS20-Kammer-2/Data-Analytics
Description: Plugin zum generieren von Videos.
Author: David Martschenko, Jannik Lapp, Max Stephan, Tanja Gutsche, Timon Pellekoorne
Version: 0.1
*/

// add to settings menu
add_action('admin_menu', 'add_menu');

function add_menu() {
  global $va_settings_page;
  $icon = plugins_url('images/icon.png', __FILE__);

  $va_settings_page = add_menu_page('VisuAnalytics Settings', 'VisuAnalytics', 'manage_options', 'visuanalytics-settings', 'visuanalytics_settings_do_page', $icon);
  
  // Define the Menu Page HTML
  function visuanalytics_settings_do_page() {
    ?>
        <div id="root" />
	  <?php
  }

  add_action( 'load-' . $va_settings_page, 'init_va_menu' );

  // add link to Plugin Menu Page
  add_filter('plugin_action_links_' . plugin_basename(__FILE__), function ($links) {
    $settings_link = '<a href="admin.php?page=visuanalytics-settings">' . __( 'Starten' ) . '</a>';
    array_unshift($links, $settings_link);
    return $links;
  });
}

// Inizalisize the Plugin Menu Page
function init_va_menu() {
  add_action( 'admin_enqueue_scripts', 'add_va_scripts' );
}

function add_va_scripts() {
  /* Remove forms wp-Styles */
  wp_deregister_style("forms");
  wp_enqueue_style("forms", 'common');

  // add js files
  $files = glob(plugin_dir_path( __FILE__ ) . "/src/js/*.js");
  
  foreach ($files as $file) {
	  $file_name = basename($file, ".js");
	  $file_url = plugins_url("src/js/" . basename($file), __FILE__);
	
    wp_enqueue_script($file_name, $file_url, array (), '', true);
  }

  // add css files
  wp_enqueue_style("va_css_main", plugins_url("src/css/main.css", __FILE__));
}