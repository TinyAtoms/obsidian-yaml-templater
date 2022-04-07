# YAML templater
This plugin can generate text snippets based on the YAML Frontmatter from the current active file.

# Documentation

## Setup
In the settings tab of the plugin, specify the folder where you will be storing your plugins
## Creating templates
Create a template in that folder.

The syntax is incredibly simple: Just enclose the yaml property you want to use in double curly braces. When it can't find the property in your frontmatter, it will substitute it to `{{not found}}`
## Examples
```
Some random template where i want to include{{YAMLproperty1}}, {{YAMLproperty2}}, etc.
```

```
# Status: # {{status}}


# {{title}}

<span
	  class='ob-timelines'
	  data-date='{{date-start}}'
	  data-title=' {{title}} '
	  data-class='orange'
	  data-img = ' {{img}} '
	  data-type='range'
	  data-end="{{date-end}}">

Description

</span>

## Description
Some description
```


## Using templates
1. open a file you want to add a template to
2. place the cursor where the template should be inserted
3. search for "yaml templater" in the command pallete and select the command
4. select the template you want to insert


# Examples

Template:
```
# Status: #{{status}}


# {{title}}

<span
	  class='ob-timelines'
	  data-date='{{date-start}}'
	  data-title=' {{title}} '
	  data-class='orange'
	  data-img = ' {{img}} '
	  data-type='range'
	  data-end="{{date-end}}">

Description

</span>

## Description
Some description
```

Frontmatter
```
---
tags: event seedling
aliases:
created: Thursday, April 7th 2022, 2:15:54 pm
modified: Thursday, April 7th 2022, 2:59:58 pm
class:
title: Example
date-start: 1990-01-01-23
date-end: 1990-01-01-23
status: outline
---
```

Result
```
# Status: #outline


# Example

<span
	  class='ob-timelines'
	  data-date='1990-01-01-23'
	  data-title=' Example '
	  data-class='orange'
	  data-img = ' {{not found}} '
	  data-type='range'
	  data-end="1990-01-01-23">

Description

</span>

## Description
Some description
```
