<?php

/**
 * This file is responsible for setting our callbacks globals and for setting default values.
 */

// Each of these is an array where each key is a post type alias, and
// the value of which is an array of all callbacks associated with that post type.
global $hooky_filters, $hooky_endpoint_filters, $hooky_success_callbacks;

// Set default callbacks
$types = get_post_types();
foreach($types as $type){
  $hooky_filters[$type][]           = new HookyCallback('default', NULL);
  $hooky_endpoint_filters[$type][]  = new HookyCallback('none', NULL);
  $hooky_success_callbacks[$type][] = new HookyCallback('none', NULL);
}

/**
 * Standardized objects for Hooky callback
 * @param string   $alias       Name of callback.
 * @param function $callback    Closure that will return filter value. Receives ID argument.
 */
class HookyCallback {
  function __construct($alias, $callback){
    $this->alias    = $alias;
    $this->callback = $callback;
  }
}
