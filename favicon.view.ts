namespace $ {
	/** Плагин, который ставит favicon из переданного $mol_icon_* и подобных */
	export class $bog_favicon extends $mol_plugin {
		// сюда передаем Icon <= icon $mol_icon_waze
		@$mol_mem
		Icon(next?: $mol_view): $mol_view {
			if (next !== undefined) return next as never
			throw new Error('[bog_favicon] Icon is required: use `Icon <= icon $mol_icon_*` in view.tree')
		}

		@$mol_mem
		favicon_data(): string {
			const icon = this.Icon()
			const node = icon.dom_tree() as SVGSVGElement

			if (!node.getAttribute('xmlns')) {
				node.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
			}

			const svg = (node as any).outerHTML as string
			return 'data:image/svg+xml,' + encodeURIComponent(svg)
		}

		apply_favicon(): void {
			const doc = $mol_dom_context.document
			if (!doc) return

			const href = this.favicon_data()

			let link = doc.querySelector('link[rel="icon"]') as HTMLLinkElement | null
			if (!link) {
				link = doc.createElement('link')
				link.rel = 'icon'
				doc.head.appendChild(link)
			}

			link.type = 'image/svg+xml'
			if (link.href !== href) link.href = href
		}

		override auto() {
			this.favicon_data()
			this.apply_favicon()
			return null as any
		}

		override sub() {
			return [] as const
		}
	}
}
