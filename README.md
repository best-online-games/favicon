

example
```view.tree
	plugins /
		<= Favicon $bog_favicon
			order \random
			speed_ms 750
			stop_after_ms 0
			icons /$mol_icon
				<= Bird $mol_icon_bird
				<= Waze $mol_icon_waze
				<= Web $mol_icon_web
```
