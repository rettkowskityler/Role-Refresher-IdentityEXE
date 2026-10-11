/**
 * Copyright (C) 2026 SailPoint Technologies, Inc.  All rights reserved.
 */
// AUTO-GENERATED. Do not hand-modify.
import type { Preset } from '@primeuix/themes/types';

const data = {
	components: {
		accordion: {
			content: {
				background: '{content.background}',
				borderColor: '{content.border.color}',
				borderWidth: '0',
				color: '{text.color}',
				padding: '0 1.125rem 1.125rem',
				'padding-bottom': '1.125rem',
				'padding-left': '1.125rem',
				'padding-right': '1.125rem',
				'padding-top': '0rem',
			},
			header: {
				activeBackground: '{content.background}',
				activeColor: '{text.color}',
				activeHoverBackground: '{content.background}',
				activeHoverColor: '{text.color}',
				background: '{content.background}',
				borderColor: '{content.border.color}',
				borderRadius: '0',
				borderWidth: '0',
				color: '{text.muted.color}',
				first: {
					borderWidth: '0',
					topBorderRadius: '{content.border.radius}',
				},
				focusRing: {
					color: '{focus.ring.color}',
					offset: '{focus.ring.offset}',
					shadow: 'none',
					style: '{focus.ring.style}',
					width: '{focus.ring.width}',
				},
				fontWeight: '600',
				hoverBackground: '{content.background}',
				hoverColor: '{text.color}',
				last: {
					activeBottomBorderRadius: '0',
					bottomBorderRadius: '{content.border.radius}',
				},
				padding: '1.125rem',
				toggleIcon: {
					activeColor: '{text.color}',
					activeHoverColor: '{text.color}',
					color: '{text.muted.color}',
					hoverColor: '{text.color}',
				},
			},
			panel: {
				borderColor: '{content.border.color}',
				borderWidth: '1px',
			},
			root: {
				transitionDuration: '{transition.duration}',
			},
		},
		autocomplete: {
			root: {
				background: '{form.field.background}',
				borderColor: '{form.field.border.color}',
				borderRadius: '{form.field.border.radius}',
				color: '{form.field.color}',
				disabledBackground: '{form.field.disabled.background}',
				disabledColor: '{form.field.disabled.color}',
				filledBackground: '{form.field.filled.background}',
				filledFocusBackground: '{form.field.filled.focus.background}',
				filledHoverBackground: '{form.field.filled.hover.background}',
				focusBorderColor: '{form.field.focus.border.color}',
				focusRing: {
					color: '{form.field.focus.ring.color}',
					offset: '{form.field.focus.ring.offset}',
					shadow: 'none',
					style: '{form.field.focus.ring.style}',
					width: '{form.field.focus.ring.width}',
				},
				hoverBorderColor: '{form.field.hover.border.color}',
				invalidBorderColor: '{form.field.invalid.border.color}',
				invalidPlaceholderColor: '{form.field.invalid.placeholder.color}',
				paddingX: '{form.field.padding.x}',
				paddingY: '{form.field.padding.y}',
				placeholderColor: '{form.field.placeholder.color}',
				shadow: '0 1px 2px 0 #1212170d',
				transitionDuration: '{form.field.transition.duration}',
			},
			chip: {
				borderRadius: '{border.radius.sm}',
			},
			colorScheme: {
				light: {
					chip: {
						focusBackground: '{surface.200}',
						focusColor: '{surface.800}',
					},
					dropdown: {
						activeBackground: '{surface.300}',
						activeColor: '{surface.800}',
						background: '{surface.100}',
						color: '{surface.600}',
						hoverBackground: '{surface.200}',
						hoverColor: '{surface.700}',
					},
				},
				dark: {
					chip: {
						focusBackground: '{surface.700}',
						focusColor: '{surface.0}',
					},
					dropdown: {
						activeBackground: '{surface.600}',
						activeColor: '{surface.100}',
						background: '{slate.900}',
						color: '{surface.300}',
						hoverBackground: '{surface.700}',
						hoverColor: '{surface.200}',
					},
				},
			},
			dropdown: {
				activeBorderColor: '{form.field.border.color}',
				borderColor: '{form.field.border.color}',
				borderRadius: '{form.field.border.radius}',
				focusRing: {
					color: '{focus.ring.color}',
					offset: '{focus.ring.offset}',
					shadow: 'none',
					style: '{focus.ring.style}',
					width: '{focus.ring.width}',
				},
				hoverBorderColor: '{form.field.border.color}',
				lg: {
					width: '3rem',
				},
				sm: {
					width: '2rem',
				},
				width: '2.5rem',
			},
			emptyMessage: {
				padding: '{list.option.padding}',
			},
			list: {
				gap: '{list.gap}',
				padding: '{list.padding}',
				'padding-x': '{list.padding.x}',
				'padding-y': '{list.padding.y}',
			},
			option: {
				borderRadius: '{list.option.border.radius}',
				color: '{list.option.color}',
				focusBackground: '{list.option.focus.background}',
				focusColor: '{list.option.focus.color}',
				group: {
					padding: {
						x: '{list.option.group.padding.x}',
						y: '{list.option.group.padding.y}',
					},
				},
				padding: '{list.option.padding}',
				'padding-x': '{list.option.padding.x}',
				'padding-y': '{list.option.padding.y}',
				selectedBackground: '{list.option.selected.background}',
				selectedColor: '{list.option.selected.color}',
				selectedFocusBackground: '{list.option.selected.focus.background}',
				selectedFocusColor: '{list.option.selected.focus.color}',
			},
			optionGroup: {
				background: '{list.option.group.background}',
				color: '{list.option.group.color}',
				fontWeight: '{list.option.group.font.weight}',
				padding: '{list.option.group.padding}',
			},
			overlay: {
				background: '{overlay.select.background}',
				borderColor: '{overlay.select.border.color}',
				borderRadius: '{overlay.select.border.radius}',
				color: '{overlay.select.color}',
				shadow: '0 1px 2px -1px #0000001a, 0 1px 3px 0 #0000001a',
			},
		},
		avatar: {
			root: {
				background: '{content.border.color}',
				borderRadius: '{content.border.radius}',
				color: '{content.color}',
				fontSize: '1rem',
				height: '2rem',
				width: '2rem',
			},
			extend: {
				danger: {
					background: '{red.100}',
					color: '{red.950}',
				},
				empty: {
					background: '{blue.50}',
					color: '{primary.color}',
				},
				primary: {
					background: '{primary.100}',
					color: '{primary.700}',
				},
				success: {
					background: '{teal.100}',
					color: '{teal.950}',
				},
				warn: {
					background: '{amber.100}',
					color: '{amber.950}',
				},
			},
			group: {
				borderColor: '{content.background}',
				offset: '-0.75rem',
			},
			icon: {
				size: '1rem',
			},
			lg: {
				fontSize: '1.5rem',
				group: {
					offset: '-1rem',
				},
				height: '3rem',
				icon: {
					size: '1.5rem',
				},
				width: '3rem',
			},
			xl: {
				fontSize: '2rem',
				group: {
					offset: '-1.5rem',
				},
				height: '4rem',
				icon: {
					size: '2rem',
				},
				width: '4rem',
			},
		},
		badge: {
			root: {
				borderRadius: '{border.radius.md}',
				fontSize: '0.75rem',
				fontWeight: '700',
				height: '1.5rem',
				minWidth: '1.5rem',
				padding: '0 0.5rem',
			},
			colorScheme: {
				light: {
					contrast: {
						background: '{surface.950}',
						color: '{surface.0}',
					},
					danger: {
						background: '{red.500}',
						color: '{surface.0}',
					},
					info: {
						background: '{sky.500}',
						color: '{surface.0}',
					},
					primary: {
						background: '{primary.color}',
						color: '{primary.contrast.color}',
					},
					secondary: {
						background: '{surface.100}',
						color: '{surface.600}',
					},
					success: {
						background: '{teal.500}',
						color: '{teal.950}',
					},
					warn: {
						background: '{amber.500}',
						color: '{surface.0}',
					},
				},
				dark: {
					contrast: {
						background: '{surface.0}',
						color: '{surface.950}',
					},
					danger: {
						background: '{red.400}',
						color: '{red.950}',
					},
					info: {
						background: '{sky.400}',
						color: '{sky.950}',
					},
					primary: {
						background: '{primary.color}',
						color: '{surface.0}',
					},
					secondary: {
						background: '{surface.800}',
						color: '{surface.300}',
					},
					success: {
						background: '{teal.500}',
						color: '{teal.950}',
					},
					warn: {
						background: '{amber.400}',
						color: '{surface.950}',
					},
				},
			},
			dot: {
				size: '0.5rem',
			},
			lg: {
				fontSize: '0.875rem',
				height: '1.75rem',
				minWidth: '1.75rem',
			},
			extend: {
				padding: {
					x: '0.5rem',
					y: '0rem',
				},
			},
			sm: {
				fontSize: '0.625rem',
				height: '1.25rem',
				minWidth: '1.25rem',
			},
			xl: {
				fontSize: '1rem',
				height: '2rem',
				minWidth: '2rem',
			},
		},
		blockui: {
			root: {
				borderRadius: '{content.border.radius}',
			},
		},
		breadcrumb: {
			root: {
				background: '{surface.0}',
				gap: '0.5rem',
				padding: '1rem',
				transitionDuration: '{transition.duration}',
			},
			item: {
				borderRadius: '{content.border.radius}',
				color: '{text.muted.color}',
				focusRing: {
					color: '{focus.ring.color}',
					offset: '{focus.ring.offset}',
					shadow: 'none',
					style: '{focus.ring.style}',
					width: '{focus.ring.width}',
				},
				gap: '{navigation.item.gap}',
				hoverColor: '{text.color}',
				icon: {
					color: '{navigation.item.icon.color}',
					hoverColor: '{navigation.item.icon.focus.color}',
				},
			},
			separator: {
				color: '{navigation.item.icon.color}',
			},
		},
		button: {
			root: {
				badgeSize: '1rem',
				borderRadius: '{form.field.border.radius}',
				contrast: {
					focusRing: {
						shadow: 'none',
					},
				},
				danger: {
					focusRing: {
						shadow: 'none',
					},
				},
				focusRing: {
					offset: '{focus.ring.offset}',
					style: '{focus.ring.style}',
					width: '{focus.ring.width}',
				},
				gap: '0.5rem',
				help: {
					focusRing: {
						shadow: 'none',
					},
				},
				iconOnlyWidth: '2.5rem',
				info: {
					focusRing: {
						shadow: 'none',
					},
				},
				label: {
					fontWeight: '500',
				},
				lg: {
					fontSize: '{form.field.lg.font.size}',
					iconOnlyWidth: '3rem',
					paddingX: '{form.field.lg.padding.x}',
					paddingY: '{form.field.lg.padding.y}',
				},
				paddingX: '{form.field.padding.x}',
				paddingY: '{form.field.padding.y}',
				primary: {
					focusRing: {
						shadow: 'none',
					},
				},
				raisedShadow:
					'0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12)',
				roundedBorderRadius: '2rem',
				secondary: {
					focusRing: {
						shadow: 'none',
					},
				},
				sm: {
					fontSize: '{form.field.sm.font.size}',
					iconOnlyWidth: '2rem',
					paddingX: '{form.field.sm.padding.x}',
					paddingY: '{form.field.sm.padding.y}',
				},
				success: {
					focusRing: {
						shadow: 'none',
					},
				},
				transitionDuration: '{form.field.transition.duration}',
				warn: {
					focusRing: {
						shadow: 'none',
					},
				},
			},
			colorScheme: {
				light: {
					root: {
						contrast: {
							activeBackground: '{surface.200}',
							activeBorderColor: '{zinc.100}',
							activeColor: '{text.color}',
							background: '{surface.0}',
							borderColor: '{zinc.100}',
							color: '{text.color}',
							focusRing: {
								color: '{surface.950}',
							},
							hoverBackground: '{surface.200}',
							hoverBorderColor: '{surface.900}',
							hoverColor: '{text.color}',
						},
						danger: {
							activeBackground: '{red.700}',
							activeBorderColor: '{red.700}',
							activeColor: '{primary.contrast.color}',
							background: '{red.500}',
							borderColor: '{red.500}',
							color: '{primary.contrast.color}',
							focusRing: {
								color: '{red.500}',
							},
							hoverBackground: '{red.600}',
							hoverBorderColor: '{red.600}',
							hoverColor: '{primary.contrast.color}',
						},
						help: {
							activeBackground: '{purple.700}',
							activeBorderColor: '{purple.700}',
							activeColor: '{primary.contrast.color}',
							background: '{purple.500}',
							borderColor: '{purple.500}',
							color: '{primary.contrast.color}',
							focusRing: {
								color: '{purple.500}',
							},
							hoverBackground: '{purple.600}',
							hoverBorderColor: '{purple.600}',
							hoverColor: '{primary.contrast.color}',
						},
						info: {
							activeBackground: '{sky.700}',
							activeBorderColor: '{sky.700}',
							activeColor: '{surface.0}',
							background: '{sky.500}',
							borderColor: '{sky.500}',
							color: '{surface.0}',
							focusRing: {
								color: '{sky.500}',
							},
							hoverBackground: '{sky.600}',
							hoverBorderColor: '{sky.600}',
							hoverColor: '{surface.0}',
						},
						primary: {
							activeBackground: '{primary.active.color}',
							activeBorderColor: '{primary.active.color}',
							activeColor: '{primary.contrast.color}',
							background: '{primary.color}',
							borderColor: '{primary.550}',
							color: '{primary.contrast.color}',
							focusRing: {
								color: '{primary.color}',
							},
							hoverBackground: '{primary.hover.color}',
							hoverBorderColor: '{primary.hover.color}',
							hoverColor: '{primary.contrast.color}',
						},
						secondary: {
							activeBackground: '{surface.200}',
							activeBorderColor: '{primary.active.color}',
							activeColor: '{button.text.secondary.active.background}',
							background: '{surface.0}',
							borderColor: '{primary.200}',
							color: '{button.text.secondary.color}',
							focusRing: {
								color: '{primary.color}',
							},
							hoverBackground: '{surface.100}',
							hoverBorderColor: '{primary.hover.color}',
							hoverColor: '{button.text.secondary.hover.background}',
						},
						success: {
							activeBackground: '{teal.700}',
							activeBorderColor: '{teal.700}',
							activeColor: '{teal.950}',
							background: '{teal.500}',
							borderColor: '{teal.500}',
							color: '{teal.950}',
							focusRing: {
								color: '{green.500}',
							},
							hoverBackground: '{teal.600}',
							hoverBorderColor: '{teal.600}',
							hoverColor: '{teal.950}',
						},
						warn: {
							activeBackground: '{amber.700}',
							activeBorderColor: '{amber.700}',
							activeColor: '{primary.contrast.color}',
							background: '{amber.500}',
							borderColor: '{amber.500}',
							color: '{primary.contrast.color}',
							focusRing: {
								color: '{amber.500}',
							},
							hoverBackground: '{amber.600}',
							hoverBorderColor: '{amber.600}',
							hoverColor: '{primary.contrast.color}',
						},
					},
					link: {
						activeColor: '{primary.active.color}',
						color: '{primary.color}',
						hoverColor: '{primary.hover.color}',
					},
					outlined: {
						contrast: {
							activeBackground: '{surface.200}',
							borderColor: '{zinc.100}',
							color: '{text.color}',
							hoverBackground: '{surface.100}',
						},
						danger: {
							activeBackground: '{red.100}',
							borderColor: '{red.200}',
							color: '{red.500}',
							hoverBackground: '{red.50}',
						},
						help: {
							activeBackground: '{purple.100}',
							borderColor: '{purple.200}',
							color: '{purple.500}',
							hoverBackground: '{purple.50}',
						},
						info: {
							activeBackground: '{sky.100}',
							borderColor: '{sky.200}',
							color: '{sky.500}',
							hoverBackground: '{sky.50}',
						},
						plain: {
							activeBackground: '{surface.100}',
							borderColor: '{surface.200}',
							color: '{surface.700}',
							hoverBackground: '{surface.50}',
						},
						primary: {
							activeBackground: '{primary.100}',
							borderColor: '{primary.200}',
							color: '{primary.color}',
							hoverBackground: '{primary.50}',
						},
						secondary: {
							activeBackground: '{surface.100}',
							borderColor: '{primary.200}',
							color: '{surface.0}',
							hoverBackground: '{surface.50}',
						},
						success: {
							activeBackground: '{teal.100}',
							borderColor: '{teal.200}',
							color: '{teal.800}',
							hoverBackground: '{teal.50}',
						},
						warn: {
							activeBackground: '{amber.100}',
							borderColor: '{amber.200}',
							color: '{amber.500}',
							hoverBackground: '{amber.50}',
						},
					},
					text: {
						contrast: {
							activeBackground: '{surface.100}',
							color: '{surface.950}',
							hoverBackground: '{surface.50}',
						},
						danger: {
							activeBackground: '{red.100}',
							color: '{red.500}',
							hoverBackground: '{red.50}',
						},
						help: {
							activeBackground: '{purple.100}',
							color: '{purple.500}',
							hoverBackground: '{purple.50}',
						},
						info: {
							activeBackground: '{sky.100}',
							color: '{sky.500}',
							hoverBackground: '{sky.50}',
						},
						plain: {
							activeBackground: '{surface.100}',
							color: '{text.color}',
							hoverBackground: '{surface.100}',
						},
						primary: {
							activeBackground: '{primary.100}',
							color: '{primary.color}',
							hoverBackground: '{primary.50}',
						},
						secondary: {
							activeBackground: '{primary.active.color}',
							color: '{primary.color}',
							hoverBackground: '{primary.hover.color}',
						},
						success: {
							activeBackground: '{teal.100}',
							color: '{teal.800}',
							hoverBackground: '{teal.50}',
						},
						warn: {
							activeBackground: '{amber.100}',
							color: '{amber.500}',
							hoverBackground: '{amber.50}',
						},
					},
				},
				dark: {
					root: {
						contrast: {
							activeBackground: '{slate.900}',
							activeBorderColor: '{zinc.700}',
							activeColor: '{zinc.200}',
							background: '{slate.950}',
							borderColor: '{zinc.600}',
							color: '{text.color}',
							focusRing: {
								color: '{zinc.50}',
							},
							hoverBackground: '{slate.900}',
							hoverBorderColor: '{zinc.700}',
							hoverColor: '{zinc.200}',
						},
						danger: {
							activeBackground: '{red.200}',
							activeBorderColor: '{red.200}',
							activeColor: '{red.950}',
							background: '{red.400}',
							borderColor: '{red.400}',
							color: '{red.950}',
							focusRing: {
								color: '{red.400}',
							},
							hoverBackground: '{red.300}',
							hoverBorderColor: '{red.300}',
							hoverColor: '{red.950}',
						},
						help: {
							activeBackground: '{purple.200}',
							activeBorderColor: '{purple.200}',
							activeColor: '{purple.950}',
							background: '{purple.400}',
							borderColor: '{purple.400}',
							color: '{purple.950}',
							focusRing: {
								color: '{purple.400}',
							},
							hoverBackground: '{purple.300}',
							hoverBorderColor: '{purple.300}',
							hoverColor: '{purple.950}',
						},
						info: {
							activeBackground: '{sky.200}',
							activeBorderColor: '{sky.200}',
							activeColor: '{sky.950}',
							background: '{sky.400}',
							borderColor: '{sky.400}',
							color: '{sky.950}',
							focusRing: {
								color: '{sky.400}',
							},
							hoverBackground: '{sky.300}',
							hoverBorderColor: '{sky.300}',
							hoverColor: '{sky.950}',
						},
						primary: {
							activeBackground: '{primary.active.color}',
							activeBorderColor: '{primary.active.color}',
							activeColor: '{primary.contrast.color}',
							background: '{primary.color}',
							borderColor: '#1d5ade03',
							color: '{slate.950}',
							focusRing: {
								color: '{primary.color}',
							},
							hoverBackground: '{primary.hover.color}',
							hoverBorderColor: '{primary.hover.color}',
							hoverColor: '{primary.contrast.color}',
						},
						secondary: {
							activeBackground: '{slate.900}',
							activeBorderColor: '{lightblue.700}',
							activeColor: '{lightblue.700}',
							background: '{slate.950}',
							borderColor: '{lightblue.500}',
							color: '{button.text.secondary.color}',
							focusRing: {
								color: '{primary.color}',
							},
							hoverBackground: '{slate.800}',
							hoverBorderColor: '{lightblue.600}',
							hoverColor: '{lightblue.600}',
						},
						success: {
							activeBackground: '{teal.700}',
							activeBorderColor: '{teal.700}',
							activeColor: '{teal.950}',
							background: '{teal.500}',
							borderColor: '{teal.500}',
							color: '{teal.950}',
							focusRing: {
								color: '{green.400}',
							},
							hoverBackground: '{teal.600}',
							hoverBorderColor: '{teal.600}',
							hoverColor: '{teal.950}',
						},
						warn: {
							activeBackground: '{amber.200}',
							activeBorderColor: '{amber.200}',
							activeColor: '{amber.950}',
							background: '{amber.400}',
							borderColor: '{amber.400}',
							color: '{amber.950}',
							focusRing: {
								color: '{amber.400}',
							},
							hoverBackground: '{amber.300}',
							hoverBorderColor: '{amber.300}',
							hoverColor: '{amber.950}',
						},
					},
					link: {
						activeColor: '{lightblue.700}',
						color: '{lightblue.500}',
						hoverColor: '{lightblue.600}',
					},
					outlined: {
						contrast: {
							activeBackground: '{zinc.900}',
							borderColor: '{button.contrast.hover.border.color}',
							color: '{text.color}',
							hoverBackground: '{zinc.900}',
						},
						danger: {
							activeBackground: '#f8717129',
							borderColor: '{red.700}',
							color: '{red.400}',
							hoverBackground: '#f871710a',
						},
						help: {
							activeBackground: '#c084fc29',
							borderColor: '{purple.700}',
							color: '{purple.400}',
							hoverBackground: '#c084fc0a',
						},
						info: {
							activeBackground: '#38bdf829',
							borderColor: '{sky.700}',
							color: '{sky.400}',
							hoverBackground: '#38bdf80a',
						},
						plain: {
							activeBackground: '{surface.700}',
							borderColor: '{surface.600}',
							color: '{surface.0}',
							hoverBackground: '{surface.800}',
						},
						primary: {
							activeBackground: '#34d39929',
							borderColor: '{primary.color}',
							color: '{primary.color}',
							hoverBackground: '#34d3990a',
						},
						secondary: {
							activeBackground: '#ffffff29',
							borderColor: '{primary.color}',
							color: '{carbon.800}',
							hoverBackground: '#ffffff0a',
						},
						success: {
							activeBackground: '#1b8c7129',
							borderColor: '{teal.500}',
							color: '{teal.500}',
							hoverBackground: '#20aa8914',
						},
						warn: {
							activeBackground: '#fb923c29',
							borderColor: '{amber.700}',
							color: '{amber.400}',
							hoverBackground: '#fb923c0a',
						},
					},
					text: {
						contrast: {
							activeBackground: '{surface.700}',
							color: '{zinc.100}',
							hoverBackground: '{surface.800}',
						},
						danger: {
							activeBackground: '#f8717129',
							color: '{red.400}',
							hoverBackground: '#f871710a',
						},
						help: {
							activeBackground: '#c084fc29',
							color: '{purple.400}',
							hoverBackground: '#c084fc0a',
						},
						info: {
							activeBackground: '#38bdf829',
							color: '{sky.400}',
							hoverBackground: '#38bdf80a',
						},
						plain: {
							activeBackground: '{surface.700}',
							color: '{surface.0}',
							hoverBackground: '{surface.200}',
						},
						primary: {
							activeBackground: '#34d39929',
							color: '{primary.color}',
							hoverBackground: '#34d3990a',
						},
						secondary: {
							activeBackground: '{primary.600}',
							color: '{lightblue.500}',
							hoverBackground: '{primary.600}',
						},
						success: {
							activeBackground: '#1b8c7129',
							color: '{teal.500}',
							hoverBackground: '#20aa8914',
						},
						warn: {
							activeBackground: '#fb923c29',
							color: '{amber.400}',
							hoverBackground: '#fb923c0a',
						},
					},
				},
			},
			extend: {
				min: {
					width: '7.5rem',
				},
				raised: {
					background: 'light-dark(#ffffff03, #00000003)',
				},
			},
		},
		card: {
			root: {
				background: '{content.background}',
				borderRadius: '{border.radius.xl}',
				color: '{content.color}',
				shadow: '0 1px 2px -1px #0000001a, 0 1px 3px 0 #0000001a',
			},
			body: {
				gap: '1.143rem',
				padding: '1.25rem',
			},
			caption: {
				gap: '0.5rem',
			},
			subtitle: {
				color: '{text.muted.color}',
			},
			title: {
				fontSize: '1.25rem',
				fontWeight: '500',
			},
		},
		carousel: {
			content: {
				gap: '0.25rem',
			},
			indicator: {
				activeBackground: '{primary.color}',
				borderRadius: '{content.border.radius}',
				focusRing: {
					color: '{focus.ring.color}',
					offset: '{focus.ring.offset}',
					shadow: 'none',
					style: '{focus.ring.style}',
					width: '{focus.ring.width}',
				},
				height: '0.5rem',
				width: '2rem',
			},
			colorScheme: {
				light: {
					indicator: {
						background: '{surface.200}',
						hoverBackground: '{surface.300}',
					},
				},
				dark: {
					indicator: {
						background: '{surface.700}',
						hoverBackground: '{surface.600}',
					},
				},
			},
			indicatorList: {
				gap: '0.5rem',
				padding: '1rem',
			},
			extend: {
				item: {
					tag: {
						background: 'light-dark(#00000000, #000000b2)',
					},
				},
			},
			root: {
				transitionDuration: '{transition.duration}',
			},
		},
		cascadeselect: {
			root: {
				background: '{form.field.background}',
				borderColor: '{form.field.border.color}',
				borderRadius: '{form.field.border.radius}',
				color: '{form.field.color}',
				disabledBackground: '{form.field.disabled.background}',
				disabledColor: '{form.field.disabled.color}',
				filledBackground: '{form.field.filled.background}',
				filledFocusBackground: '{form.field.filled.focus.background}',
				filledHoverBackground: '{form.field.filled.hover.background}',
				focusBorderColor: '{form.field.focus.border.color}',
				focusRing: {
					color: '{form.field.focus.ring.color}',
					offset: '{form.field.focus.ring.offset}',
					shadow: 'none',
					style: '{form.field.focus.ring.style}',
					width: '{form.field.focus.ring.width}',
				},
				hoverBorderColor: '{form.field.hover.border.color}',
				invalidBorderColor: '{form.field.invalid.border.color}',
				invalidPlaceholderColor: '{form.field.invalid.placeholder.color}',
				lg: {
					fontSize: '{form.field.lg.font.size}',
					paddingX: '{form.field.lg.padding.x}',
					paddingY: '{form.field.lg.padding.y}',
				},
				paddingX: '{form.field.padding.x}',
				paddingY: '{form.field.padding.y}',
				placeholderColor: '{form.field.placeholder.color}',
				shadow: '0 1px 2px 0 #1212170d',
				sm: {
					fontSize: '{form.field.sm.font.size}',
					paddingX: '{form.field.sm.padding.x}',
					paddingY: '{form.field.sm.padding.y}',
				},
				transitionDuration: '{form.field.transition.duration}',
			},
			clearIcon: {
				color: '{form.field.icon.color}',
			},
			dropdown: {
				color: '{form.field.icon.color}',
				width: '2.5rem',
			},
			list: {
				gap: '{list.gap}',
				mobileIndent: '1rem',
				padding: '{list.padding}',
				'padding-x': '{list.padding.x}',
				'padding-y': '{list.padding.y}',
			},
			option: {
				borderRadius: '{list.option.border.radius}',
				color: '{list.option.color}',
				focusBackground: '{list.option.focus.background}',
				focusColor: '{list.option.focus.color}',
				icon: {
					color: '{list.option.icon.color}',
					focusColor: '{list.option.icon.focus.color}',
					size: '0.875rem',
				},
				padding: '{list.option.padding}',
				'padding-x': '{list.option.padding.x}',
				'padding-y': '{list.option.padding.y}',
				selectedBackground: '{list.option.selected.background}',
				selectedColor: '{list.option.selected.color}',
				selectedFocusBackground: '{list.option.selected.focus.background}',
				selectedFocusColor: '{list.option.selected.focus.color}',
			},
			overlay: {
				background: '{overlay.select.background}',
				borderColor: '{overlay.select.border.color}',
				borderRadius: '{overlay.select.border.radius}',
				color: '{overlay.select.color}',
				shadow: '0 1px 2px -1px #0000001a, 0 1px 3px 0 #0000001a',
			},
		},
		checkbox: {
			root: {
				background: '{surface.0}',
				borderColor: '{form.field.border.color}',
				borderRadius: '{border.radius.sm}',
				checkedBackground: '{teal.500}',
				checkedBorderColor: '{teal.500}',
				checkedDisabledBorderColor: '{teal.100}',
				checkedFocusBorderColor: '{primary.color}',
				checkedHoverBackground: '{teal.300}',
				checkedHoverBorderColor: '{teal.300}',
				disabledBackground: '{form.field.disabled.background}',
				filledBackground: '{form.field.filled.background}',
				focusBorderColor: '{form.field.border.color}',
				focusRing: {
					color: '{teal.500}',
					offset: '{focus.ring.offset}',
					shadow: 'none',
					style: '{focus.ring.style}',
					width: '{focus.ring.width}',
				},
				height: '1.25rem',
				hoverBorderColor: '{form.field.hover.border.color}',
				invalidBorderColor: '{form.field.invalid.border.color}',
				lg: {
					height: '1.5rem',
					width: '1.5rem',
				},
				shadow: '0 1px 2px 0 #1212170d',
				sm: {
					height: '1rem',
					width: '1rem',
				},
				transitionDuration: '{form.field.transition.duration}',
				width: '1.25rem',
			},
			extend: {
				checked: {
					disabled: {
						background: {
							color: '{teal.100}',
						},
					},
				},
			},
			icon: {
				checkedColor: '{teal.950}',
				checkedHoverColor: '{teal.950}',
				color: '{form.field.color}',
				disabledColor: '{teal.800}',
				lg: {
					size: '1rem',
				},
				size: '0.875rem',
				sm: {
					size: '0.75rem',
				},
			},
		},
		chip: {
			colorScheme: {
				light: {
					root: {
						background: '{zinc.500}',
						color: '{zinc.50}',
					},
					icon: {
						color: '{zinc.50}',
					},
					removeIcon: {
						color: '{zinc.50}',
					},
				},
				dark: {
					root: {
						background: '{zinc.100}',
						color: '{surface.900}',
					},
					icon: {
						color: '{surface.900}',
					},
					removeIcon: {
						color: '{surface.900}',
					},
				},
			},
			root: {
				borderRadius: '{border.radius.sm}',
				gap: '0.5rem',
				paddingX: '0.75rem',
				paddingY: '0.5rem',
				transitionDuration: '{transition.duration}',
			},
			icon: {
				size: '1rem',
			},
			image: {
				height: '2rem',
				width: '2rem',
			},
			removeIcon: {
				focusRing: {
					color: '{zinc.50}',
					offset: '{focus.ring.offset}',
					shadow: 'none',
					style: '{focus.ring.style}',
					width: '{focus.ring.width}',
				},
				size: '1rem',
			},
		},
		colorpicker: {
			colorScheme: {
				light: {
					handle: {
						color: '{surface.0}',
					},
					panel: {
						background: '{surface.800}',
						borderColor: '{surface.900}',
					},
				},
				dark: {
					handle: {
						color: '{surface.0}',
					},
					panel: {
						background: '{surface.900}',
						borderColor: '{surface.700}',
					},
				},
			},
			panel: {
				borderRadius: '{overlay.popover.border.radius}',
				shadow: '{overlay.popover.shadow}',
			},
			preview: {
				borderRadius: '{form.field.border.radius}',
				focusRing: {
					color: '{focus.ring.color}',
					offset: '{focus.ring.offset}',
					shadow: '{focus.ring.shadow}',
					style: '{focus.ring.style}',
					width: '{focus.ring.width}',
				},
				height: '1.5rem',
				width: '1.5rem',
			},
			root: {
				transitionDuration: '{transition.duration}',
			},
		},
		confirmdialog: {
			content: {
				gap: '1rem',
			},
			icon: {
				color: '{overlay.modal.color}',
				size: '2rem',
			},
		},
		confirmpopup: {
			root: {
				arrowOffset: '1.25rem',
				background: '{overlay.popover.background}',
				borderColor: '{overlay.popover.border.color}',
				borderRadius: '{overlay.popover.border.radius}',
				color: '{overlay.popover.color}',
				gutter: '10px',
				shadow: '0 2px 4px -2px #0000001a, 0 4px 6px -1px #0000001a',
			},
			content: {
				gap: '1rem',
				padding: '{overlay.popover.padding}',
			},
			footer: {
				gap: '0.5rem',
				padding: '0 {overlay.popover.padding} {overlay.popover.padding}',
				'padding-bottom': '{overlay.popover.padding}',
				'padding-left': '{overlay.popover.padding}',
				'padding-right': '{overlay.popover.padding}',
				'padding-top': '0px',
			},
			icon: {
				color: '{overlay.popover.color}',
				size: '1.5rem',
			},
		},
		contextmenu: {
			root: {
				background: '{content.background}',
				borderColor: '{content.border.color}',
				borderRadius: '{content.border.radius}',
				color: '{content.color}',
				shadow: '0 2px 4px -2px #0000001a, 0 4px 6px -1px #0000001a',
				transitionDuration: '{transition.duration}',
			},
			item: {
				activeBackground: '{navigation.item.active.background}',
				activeColor: '{navigation.item.active.color}',
				borderRadius: '{navigation.item.border.radius}',
				color: '{navigation.item.color}',
				focusBackground: '{navigation.item.focus.background}',
				focusColor: '{navigation.item.focus.color}',
				gap: '{navigation.item.gap}',
				icon: {
					activeColor: '{navigation.item.icon.active.color}',
					color: '{navigation.item.icon.color}',
					focusColor: '{navigation.item.icon.focus.color}',
				},
				padding: '0.5rem 0.75rem',
				'padding-x': '0.75rem',
				'padding-y': '0.5rem',
			},
			list: {
				gap: '{navigation.list.gap}',
				padding: '{navigation.list.padding}',
				'padding-x': '{navigation.list.padding.x}',
				'padding-y': '{navigation.list.padding.y}',
			},
			separator: {
				borderColor: '{content.border.color}',
			},
			submenuIcon: {
				activeColor: '{navigation.submenu.icon.active.color}',
				color: '{navigation.submenu.icon.color}',
				focusColor: '{navigation.submenu.icon.focus.color}',
				size: '{navigation.submenu.icon.size}',
			},
			submenu: {
				mobileIndent: '1rem',
			},
		},
		datatable: {
			bodyCell: {
				borderColor: '{datatable.border.color}',
				lg: {
					padding: '1rem 1.25rem',
				},
				padding: '0.75rem 1rem',
				sm: {
					padding: '0.375rem 0.5rem',
				},
			},
			extend: {
				body: {
					cell: {
						lg: {
							padding: {
								x: '1.25rem',
								y: '1rem',
							},
						},
						padding: {
							x: '1rem',
							y: '0.75rem',
						},
						sm: {
							padding: {
								x: '0.5rem',
								y: '0.375rem',
							},
						},
					},
				},
			},
			colorScheme: {
				light: {
					bodyCell: {
						selectedBorderColor: '{primary.100}',
					},
					root: {
						borderColor: '{content.border.color}',
					},
					row: {
						stripedBackground: '{zinc.50}',
					},
				},
				dark: {
					bodyCell: {
						selectedBorderColor: '{primary.900}',
					},
					root: {
						borderColor: '{zinc.600}',
					},
					row: {
						stripedBackground: '{slate.900}',
					},
				},
			},
			columnFooter: {
				fontWeight: '600',
			},
			columnResizer: {
				width: '0.5rem',
			},
			columnTitle: {
				fontWeight: '600',
			},
			dropPoint: {
				color: '{primary.color}',
			},
			filter: {
				constraint: {
					borderRadius: '{list.option.border.radius}',
					color: '{list.option.color}',
					focusBackground: '{list.option.focus.background}',
					focusColor: '{list.option.focus.color}',
					padding: '{list.option.padding}',
					selectedBackground: '{list.option.selected.background}',
					selectedColor: '{list.option.selected.color}',
					selectedFocusBackground: '{list.option.selected.focus.background}',
					selectedFocusColor: '{list.option.selected.focus.color}',
					separator: {
						borderColor: '{content.border.color}',
					},
				},
				constraintList: {
					gap: '{list.gap}',
					padding: '{list.padding}',
				},
				inlineGap: '0.5rem',
				overlayPopover: {
					background: '{overlay.popover.background}',
					borderColor: '{overlay.popover.border.color}',
					borderRadius: '{overlay.popover.border.radius}',
					color: '{overlay.popover.color}',
					gap: '0.5rem',
					padding: '{overlay.popover.padding}',
					shadow: '0 2px 4px -2px #0000001a, 0 4px 6px -1px #0000001a',
				},
				overlaySelect: {
					background: '{overlay.select.background}',
					borderColor: '{overlay.select.border.color}',
					borderRadius: '{overlay.select.border.radius}',
					color: '{overlay.select.color}',
					shadow: '0 2px 4px -2px #0000001a, 0 4px 6px -1px #0000001a',
				},
				rule: {
					borderColor: '{content.border.color}',
				},
			},
			footer: {
				background: '{content.background}',
				borderColor: '{datatable.border.color}',
				borderWidth: '1px',
				cell: {
					lg: {
						padding: {
							x: '1.25rem',
							y: '1rem',
						},
					},
					padding: {
						x: '1rem',
						y: '0.75rem',
					},
					sm: {
						padding: {
							x: '0.5rem',
							y: '0.375rem',
						},
					},
				},
				color: '{content.color}',
				lg: {
					padding: '1rem 1.25rem',
					'padding-x': '1.25rem',
					'padding-y': '1rem',
				},
				padding: '0.75rem 1rem',
				'padding-x': '1rem',
				'padding-y': '0.75rem',
				sm: {
					padding: '0.375rem 0.5rem',
					'padding-x': '0.5rem',
					'padding-y': '0.375rem',
				},
			},
			footerCell: {
				background: '{content.background}',
				borderColor: '{datatable.border.color}',
				color: '{content.color}',
				lg: {
					padding: '1rem 1.25rem',
				},
				padding: '0.75rem 1rem',
				sm: {
					padding: '0.375rem 0.5rem',
				},
			},
			header: {
				background: '{content.background}',
				borderColor: '{datatable.border.color}',
				borderWidth: '1px',
				cell: {
					lg: {
						padding: {
							x: '1.25rem',
							y: '1rem',
						},
					},
					padding: {
						x: '1rem',
						y: '0.75rem',
					},
					sm: {
						padding: {
							x: '0.5rem',
							y: '0.375rem',
						},
					},
				},
				color: '{content.color}',
				lg: {
					padding: '1rem 1.25rem',
					'padding-x': '1.25rem',
					'padding-y': '1rem',
				},
				padding: '0.75rem 1rem',
				'padding-x': '1rem',
				'padding-y': '0.75rem',
				sm: {
					padding: '0.375rem 0.5rem',
					'padding-x': '0.5rem',
					'padding-y': '0.375rem',
				},
			},
			headerCell: {
				background: '{content.background}',
				borderColor: '{datatable.border.color}',
				color: '{content.color}',
				focusRing: {
					color: '{focus.ring.color}',
					offset: '-1px',
					shadow: 'none',
					style: '{focus.ring.style}',
					width: '{focus.ring.width}',
				},
				gap: '0.5rem',
				hoverBackground: '{content.hover.background}',
				hoverColor: '{content.hover.color}',
				lg: {
					padding: '1rem 1.25rem',
				},
				padding: '0.75rem 1rem',
				selectedBackground: '{highlight.background}',
				selectedColor: '{highlight.color}',
				sm: {
					padding: '0.375rem 0.5rem',
				},
			},
			loadingIcon: {
				size: '2rem',
			},
			paginatorBottom: {
				borderColor: '{datatable.border.color}',
				borderWidth: '1px',
			},
			paginatorTop: {
				borderColor: '{datatable.border.color}',
				borderWidth: '1px',
			},
			resizeIndicator: {
				color: '{primary.color}',
				width: '1px',
			},
			row: {
				background: '{content.background}',
				color: '{content.color}',
				focusRing: {
					color: '{focus.ring.color}',
					offset: '-1px',
					shadow: 'none',
					style: '{focus.ring.style}',
					width: '{focus.ring.width}',
				},
				hoverBackground: '{content.hover.background}',
				hoverColor: '{content.hover.color}',
				selectedBackground: '{highlight.background}',
				selectedColor: '{highlight.color}',
			},
			rowToggleButton: {
				borderRadius: '12.25px',
				color: '{text.muted.color}',
				focusRing: {
					color: '{focus.ring.color}',
					offset: '{focus.ring.offset}',
					shadow: 'none',
					style: '{focus.ring.style}',
					width: '{focus.ring.width}',
				},
				hoverBackground: '{content.hover.background}',
				hoverColor: '{text.color}',
				selectedHoverBackground: '{content.background}',
				selectedHoverColor: '{primary.color}',
				size: '1.75rem',
			},
			sortIcon: {
				color: '{text.muted.color}',
				hoverColor: '{text.hover.muted.color}',
				size: '0.875rem',
			},
			root: {
				transitionDuration: '{transition.duration}',
			},
		},
		dataview: {
			root: {
				borderColor: '#00000000',
				borderRadius: '0',
				borderWidth: '0',
				padding: '0',
			},
			content: {
				background: '{content.background}',
				borderColor: '#00000000',
				borderRadius: '0',
				borderWidth: '0',
				color: '{content.color}',
				padding: '0',
			},
			footer: {
				background: '{content.background}',
				borderColor: '{content.border.color}',
				borderRadius: '0',
				borderWidth: '1px',
				color: '{content.color}',
				padding: '0.75rem 1rem',
				'padding-x': '1rem',
				'padding-y': '0.75rem',
			},
			header: {
				background: '{content.background}',
				borderColor: '{content.border.color}',
				borderRadius: '0',
				borderWidth: '1px',
				color: '{content.color}',
				padding: '0.75rem 1rem',
				'padding-x': '1rem',
				'padding-y': '0.75rem',
			},
			paginatorBottom: {
				borderColor: '{content.border.color}',
				borderWidth: '1px',
			},
			paginatorTop: {
				borderColor: '{content.border.color}',
				borderWidth: '1px',
			},
		},
		datepicker: {
			buttonbar: {
				borderColor: '{content.border.color}',
				padding: '0.5rem 0 0',
				'padding-bottom': '0rem',
				'padding-left': '0rem',
				'padding-right': '0rem',
				'padding-top': '0.5rem',
			},
			date: {
				borderRadius: '1rem',
				color: '{content.color}',
				focusRing: {
					color: '{focus.ring.color}',
					offset: '{focus.ring.offset}',
					shadow: 'none',
					style: '{focus.ring.style}',
					width: '{focus.ring.width}',
				},
				height: '2rem',
				hoverBackground: '{content.hover.background}',
				hoverColor: '{content.hover.color}',
				padding: '0.25rem',
				rangeSelectedBackground: 'light-dark({slate.100}, {highlight.background})',
				rangeSelectedColor: '{highlight.color}',
				selectedBackground: '{primary.color}',
				selectedColor: '{primary.contrast.color}',
				width: '2rem',
			},
			dayView: {
				margin: '0.5rem 0 0',
			},
			extend: {
				day: {
					view: {
						margin: {
							bottom: '0rem',
							left: '0rem',
							right: '0rem',
							top: '0.5rem',
						},
					},
				},
				select: {
					month: {
						padding: {
							x: '0.5rem',
							y: '0.25rem',
						},
					},
					year: {
						padding: {
							x: '0.5rem',
							y: '0.25rem',
						},
					},
				},
				time: {
					picker: {
						padding: {
							bottom: '0rem',
							left: '0rem',
							right: '0rem',
							top: '0.5rem',
						},
					},
				},
			},
			colorScheme: {
				light: {
					dropdown: {
						activeBackground: '{surface.300}',
						activeColor: '{surface.800}',
						background: '{surface.100}',
						color: '{surface.600}',
						hoverBackground: '{surface.200}',
						hoverColor: '{surface.700}',
					},
					today: {
						background: '{surface.200}',
						color: '{surface.900}',
					},
				},
				dark: {
					dropdown: {
						activeBackground: '{surface.600}',
						activeColor: '{surface.100}',
						background: '{surface.800}',
						color: '{surface.300}',
						hoverBackground: '{surface.700}',
						hoverColor: '{surface.200}',
					},
					today: {
						background: '{surface.700}',
						color: '{surface.0}',
					},
				},
			},
			dropdown: {
				activeBorderColor: '{form.field.border.color}',
				borderColor: '{form.field.border.color}',
				borderRadius: '{form.field.border.radius}',
				focusRing: {
					color: '{focus.ring.color}',
					offset: '{focus.ring.offset}',
					shadow: 'none',
					style: '{focus.ring.style}',
					width: '{focus.ring.width}',
				},
				hoverBorderColor: '{form.field.border.color}',
				lg: {
					width: '3rem',
				},
				sm: {
					width: '2rem',
				},
				width: '2.5rem',
			},
			group: {
				borderColor: '{content.border.color}',
				gap: '{overlay.popover.padding}',
			},
			header: {
				background: '{content.background}',
				borderColor: '{content.border.color}',
				color: '{content.color}',
				padding: '0 0 0.5rem',
				'padding-bottom': '0.5rem',
				'padding-left': '0rem',
				'padding-right': '0rem',
				'padding-top': '0rem',
			},
			inputIcon: {
				color: '{form.field.icon.color}',
			},
			month: {
				borderRadius: '{content.border.radius}',
				padding: '0.375rem',
				view: {
					margin: {
						bottom: '0rem',
						left: '0rem',
						right: '0rem',
						top: '0.5rem',
					},
				},
			},
			monthView: {
				margin: '0.5rem 0 0',
			},
			panel: {
				background: '{content.background}',
				borderColor: '{content.border.color}',
				borderRadius: '{content.border.radius}',
				color: '{content.color}',
				padding: '{overlay.popover.padding}',
				shadow: '0 1px 2px -1px #0000001a, 0 1px 3px 0 #0000001a',
			},
			selectMonth: {
				borderRadius: '{content.border.radius}',
				color: '{content.color}',
				hoverBackground: '{content.hover.background}',
				hoverColor: '{content.hover.color}',
				padding: '0.25rem 0.5rem',
			},
			selectYear: {
				borderRadius: '{content.border.radius}',
				color: '{content.color}',
				hoverBackground: '{content.hover.background}',
				hoverColor: '{content.hover.color}',
				padding: '0.25rem 0.5rem',
			},
			timePicker: {
				borderColor: '{content.border.color}',
				buttonGap: '0.25rem',
				gap: '0.5rem',
				padding: '0.5rem 0 0',
			},
			title: {
				fontWeight: '500',
				gap: '0.5rem',
			},
			root: {
				transitionDuration: '{form.field.transition.duration}',
			},
			weekDay: {
				color: '{content.color}',
				fontWeight: '500',
				padding: '0.25rem',
			},
			year: {
				borderRadius: '{content.border.radius}',
				padding: '0.375rem',
				view: {
					margin: {
						bottom: '0rem',
						left: '0rem',
						right: '0rem',
						top: '0.5rem',
					},
				},
			},
			yearView: {
				margin: '0.5rem 0 0',
			},
		},
		dialog: {
			root: {
				background: '{overlay.modal.background}',
				borderColor: '{overlay.modal.border.color}',
				borderRadius: '{overlay.modal.border.radius}',
				color: '{overlay.modal.color}',
				shadow: '0 8px 10px -6px #0000001a, 0 20px 25px -5px #0000001a',
			},
			content: {
				padding: '0 {overlay.modal.padding} {overlay.modal.padding}',
				'padding-bottom': '{overlay.modal.padding}',
				'padding-left': '{overlay.modal.padding}',
				'padding-right': '{overlay.modal.padding}',
				'padding-top': '0px',
			},
			footer: {
				gap: '0.5rem',
				padding: '0 {overlay.modal.padding} {overlay.modal.padding}',
				'padding-bottom': '{overlay.modal.padding}',
				'padding-left': '{overlay.modal.padding}',
				'padding-right': '{overlay.modal.padding}',
				'padding-top': '0px',
			},
			header: {
				gap: '0.5rem',
				padding: '{overlay.modal.padding}',
			},
			title: {
				fontSize: '1.25rem',
				fontWeight: '600',
			},
		},
		divider: {
			root: {
				borderColor: '{content.border.color}',
			},
			content: {
				background: '{content.background}',
				color: '{text.color}',
			},
			horizontal: {
				content: {
					padding: '0 0.5rem',
					'padding-x': '0.5rem',
					'padding-y': '0rem',
				},
				margin: '1rem 0',
				'margin-x': '0rem',
				'margin-y': '1rem',
				padding: '0',
			},
			vertical: {
				content: {
					padding: '0.5rem 0',
					'padding-x': '0rem',
					'padding-y': '0.5rem',
				},
				margin: '0 1rem',
				'margin-x': '1rem',
				'margin-y': '0rem',
				padding: '0',
			},
		},
		dock: {
			root: {
				background: '#ffffff1a',
				borderColor: '#ffffff33',
				borderRadius: '{border.radius.xl}',
				padding: '0.5rem',
			},
			item: {
				borderRadius: '{content.border.radius}',
				focusRing: {
					color: '{focus.ring.color}',
					offset: '{focus.ring.offset}',
					shadow: 'none',
					style: '{focus.ring.style}',
					width: '{focus.ring.width}',
				},
				padding: '0.5rem',
				size: '3rem',
			},
		},
		drawer: {
			root: {
				background: '{overlay.modal.background}',
				borderColor: '{overlay.modal.border.color}',
				color: '{overlay.modal.color}',
				shadow: '0 8px 10px -6px #0000001a, 0 20px 25px -5px #0000001a',
			},
			extend: {
				border: {
					radius: '{overlay.modal.border.radius}',
				},
			},
			content: {
				padding: '0 {overlay.modal.padding} {overlay.modal.padding}',
				'padding-bottom': '{overlay.modal.padding}',
				'padding-left': '{overlay.modal.padding}',
				'padding-right': '{overlay.modal.padding}',
				'padding-top': '0px',
			},
			footer: {
				padding: '{overlay.modal.padding}',
			},
			header: {
				padding: '{overlay.modal.padding}',
			},
			title: {
				fontSize: '1.5rem',
				fontWeight: '600',
			},
		},
		editor: {
			content: {
				background: '{form.field.background}',
				borderColor: '{content.border.color}',
				borderRadius: '{content.border.radius}',
				color: '{content.color}',
			},
			overlay: {
				background: '{overlay.select.background}',
				borderColor: '{overlay.select.border.color}',
				borderRadius: '{overlay.select.border.radius}',
				color: '{overlay.select.color}',
				padding: '{list.padding}',
				shadow: '0 2px 4px -2px #0000001a, 0 4px 6px -1px #0000001a',
			},
			overlayOption: {
				borderRadius: '{list.option.border.radius}',
				color: '{list.option.color}',
				focusBackground: '{list.option.focus.background}',
				focusColor: '{list.option.focus.color}',
				padding: '{list.option.padding}',
			},
			toolbar: {
				background: '{content.background}',
				borderColor: '{content.border.color}',
				borderRadius: '{content.border.radius}',
			},
			toolbarItem: {
				activeColor: '{primary.color}',
				color: '{text.muted.color}',
				hoverColor: '{text.color}',
			},
		},
		fieldset: {
			root: {
				background: '{content.background}',
				borderColor: '{content.border.color}',
				borderRadius: '{content.border.radius}',
				color: '{content.color}',
				padding: '1.125rem',
				transitionDuration: '{transition.duration}',
			},
			content: {
				padding: '0',
			},
			legend: {
				background: '{content.background}',
				borderColor: '#00000000',
				borderRadius: '{content.border.radius}',
				borderWidth: '1px',
				color: '{content.color}',
				focusRing: {
					color: '{focus.ring.color}',
					offset: '{focus.ring.offset}',
					shadow: 'none',
					style: '{focus.ring.style}',
					width: '{focus.ring.width}',
				},
				fontWeight: '600',
				gap: '0.5rem',
				hoverBackground: '{content.hover.background}',
				hoverColor: '{content.hover.color}',
				padding: '0.5rem 0.75rem',
				'padding-x': '0.75rem',
				'padding-y': '0.5rem',
			},
			extend: {
				padding: {
					bottom: '{scale.1-125}',
					left: '{scale.1-125}',
					right: '{scale.1-125}',
					top: '{scale.1-125}',
				},
			},
			toggleIcon: {
				color: '{text.muted.color}',
				hoverColor: '{text.hover.muted.color}',
			},
		},
		fileupload: {
			root: {
				background: '{content.background}',
				borderColor: '{content.border.color}',
				borderRadius: '{border.radius.xl}',
				color: '{content.color}',
				transitionDuration: '{transition.duration}',
			},
			basic: {
				gap: '0.5rem',
			},
			content: {
				gap: '1rem',
				highlightBorderColor: '{primary.color}',
				padding: '0 1.125rem 1.125rem',
				'padding-bottom': '1.125rem',
				'padding-left': '1.125rem',
				'padding-right': '1.125rem',
				'padding-top': '0rem',
			},
			file: {
				borderColor: '{content.border.color}',
				gap: '1rem',
				info: {
					gap: '0.5rem',
				},
				padding: '1rem',
			},
			fileList: {
				gap: '0.5rem',
			},
			header: {
				background: '#00000000',
				borderColor: '#00000000',
				borderRadius: '0',
				borderWidth: '0',
				color: '{text.color}',
				gap: '0.5rem',
				padding: '1.125rem',
			},
			progressbar: {
				height: '0.25rem',
			},
		},
		floatlabel: {
			root: {
				activeColor: '{form.field.float.label.active.color}',
				active: {
					fontSize: '0.75rem',
					fontWeight: '400',
				},
				color: '{form.field.float.label.color}',
				focusColor: '{form.field.float.label.focus.color}',
				fontWeight: '500',
				invalidColor: '{form.field.float.label.invalid.color}',
				positionX: '{form.field.padding.x}',
				positionY: '{form.field.padding.y}',
				transitionDuration: '{form.field.transition.duration}',
			},
			in: {
				active: {
					top: '{form.field.padding.y}',
				},
				input: {
					paddingBottom: '{form.field.padding.y}',
					paddingTop: '1.5rem',
				},
			},
			on: {
				active: {
					background: '{form.field.background}',
					padding: '0 0.125rem',
					'padding-x': '0.125rem',
					'padding-y': '0rem',
				},
				borderRadius: '{border.radius.xs}',
			},
			over: {
				active: {
					top: '-1.25rem',
				},
			},
		},
		galleria: {
			root: {
				borderColor: '{content.border.color}',
				borderRadius: '{content.border.radius}',
				borderWidth: '1px',
				transitionDuration: '{transition.duration}',
			},
			caption: {
				background: '#00000080',
				color: '{surface.100}',
				padding: '1rem',
			},
			closeButton: {
				background: '#ffffff1a',
				borderRadius: '21px',
				color: '{surface.50}',
				focusRing: {
					color: '{focus.ring.color}',
					offset: '{focus.ring.offset}',
					shadow: 'none',
					style: '{focus.ring.style}',
					width: '{focus.ring.width}',
				},
				gutter: '0.5rem',
				hoverBackground: '#ffffff33',
				hoverColor: '{surface.0}',
				size: '3rem',
			},
			closeButtonIcon: {
				size: '1.5rem',
			},
			indicatorButton: {
				activeBackground: '{primary.color}',
				borderRadius: '7px',
				focusRing: {
					color: '{focus.ring.color}',
					offset: '{focus.ring.offset}',
					shadow: 'none',
					style: '{focus.ring.style}',
					width: '{focus.ring.width}',
				},
				height: '1rem',
				width: '1rem',
			},
			colorScheme: {
				light: {
					indicatorButton: {
						background: '{surface.200}',
						hoverBackground: '{surface.300}',
					},
					thumbnailNavButton: {
						color: '{surface.600}',
						hoverBackground: '{surface.100}',
						hoverColor: '{surface.700}',
					},
				},
				dark: {
					indicatorButton: {
						background: '{surface.700}',
						hoverBackground: '{surface.600}',
					},
					thumbnailNavButton: {
						color: '{surface.400}',
						hoverBackground: '{surface.700}',
						hoverColor: '{surface.0}',
					},
				},
			},
			indicatorList: {
				gap: '0.5rem',
				padding: '1rem',
			},
			insetIndicatorButton: {
				activeBackground: '#ffffffe5',
				background: '#ffffff66',
				hoverBackground: '#ffffff99',
			},
			insetIndicatorList: {
				background: '#00000080',
			},
			navButton: {
				background: '#ffffff1a',
				color: '{surface.100}',
				focusRing: {
					color: '{focus.ring.color}',
					offset: '{focus.ring.offset}',
					shadow: 'none',
					style: '{focus.ring.style}',
					width: '{focus.ring.width}',
				},
				gutter: '0.5rem',
				hoverBackground: '#ffffff33',
				hoverColor: '{surface.0}',
				next: {
					borderRadius: '21px',
				},
				prev: {
					borderRadius: '21px',
				},
				size: '3rem',
			},
			navIcon: {
				size: '1.5rem',
			},
			thumbnailNavButton: {
				borderRadius: '{content.border.radius}',
				focusRing: {
					color: '{focus.ring.color}',
					offset: '{focus.ring.offset}',
					shadow: 'none',
					style: '{focus.ring.style}',
					width: '{focus.ring.width}',
				},
				gutter: '0.5rem',
				size: '2rem',
			},
			thumbnailNavButtonIcon: {
				size: '1rem',
			},
			thumbnailsContent: {
				background: '{content.background}',
				padding: '1rem 0.25rem',
			},
			extend: {
				thumbnails: {
					content: {
						padding: {
							x: '0.25rem',
							y: '1rem',
						},
					},
				},
			},
		},
		iconfield: {
			icon: {
				color: '{text.color}',
			},
			extend: {
				lg: {
					icon: {
						size: '{inputtext.lg.font.size}',
					},
				},
				sm: {
					icon: {
						size: '{inputtext.sm.font.size}',
					},
				},
			},
		},
		iftalabel: {
			root: {
				color: '{form.field.float.label.color}',
				focusColor: '{form.field.float.label.focus.color}',
				fontSize: '0.75rem',
				fontWeight: '400',
				invalidColor: '{form.field.float.label.invalid.color}',
				positionX: '{form.field.padding.x}',
				top: '{form.field.padding.y}',
				transitionDuration: '{form.field.transition.duration}',
			},
			input: {
				paddingBottom: '{form.field.padding.y}',
				paddingTop: '1.5rem',
			},
		},
		image: {
			action: {
				borderRadius: '21px',
				color: '{surface.50}',
				focusRing: {
					color: '{focus.ring.color}',
					offset: '{focus.ring.offset}',
					shadow: 'none',
					style: '{focus.ring.style}',
					width: '{focus.ring.width}',
				},
				hoverBackground: '#ffffff1a',
				hoverColor: '{surface.0}',
				iconSize: '1.5rem',
				size: '3rem',
			},
			preview: {
				icon: {
					size: '1.5rem',
				},
				mask: {
					background: '{mask.background}',
					color: '{mask.color}',
				},
			},
			toolbar: {
				background: '#ffffff1a',
				blur: '8px',
				borderColor: '#ffffff33',
				borderRadius: '30px',
				borderWidth: '1px',
				gap: '0.5rem',
				padding: '0.5rem',
				position: {
					bottom: 'auto',
					left: 'auto',
					right: '1rem',
					top: '1rem',
				},
			},
			root: {
				transitionDuration: '{transition.duration}',
			},
		},
		imagecompare: {
			handle: {
				background: '#ffffff4d',
				borderColor: '#00000000',
				borderRadius: '7.5px',
				borderWidth: '0',
				focusRing: {
					color: '#ffffff4d',
					offset: '{focus.ring.offset}',
					shadow: 'none',
					style: '{focus.ring.style}',
					width: '{focus.ring.width}',
				},
				hoverBackground: '#ffffff4d',
				hoverBorderColor: '#00000000',
				hoverSize: '30px',
				size: '15px',
				transitionDuration: '{transition.duration}',
			},
		},
		inplace: {
			root: {
				borderRadius: '{content.border.radius}',
				focusRing: {
					color: '{focus.ring.color}',
					offset: '{focus.ring.offset}',
					shadow: 'none',
					style: '{focus.ring.style}',
					width: '{focus.ring.width}',
				},
				padding: '{form.field.padding.y} {form.field.padding.x}',
				transitionDuration: '{transition.duration}',
			},
			display: {
				hoverBackground: '{content.hover.background}',
				hoverColor: '{content.hover.color}',
			},
			extend: {
				padding: {
					x: '{form.field.padding.x}',
					y: '{form.field.padding.y}',
				},
			},
		},
		inputgroup: {
			addon: {
				background: '{form.field.background}',
				borderColor: '{form.field.border.color}',
				borderRadius: '{form.field.border.radius}',
				color: '{form.field.icon.color}',
				minWidth: '2.5rem',
				padding: '0.5rem',
			},
		},
		inputnumber: {
			colorScheme: {
				light: {
					button: {
						activeBackground: '{surface.200}',
						activeBorderColor: '{form.field.border.color}',
						activeColor: '{surface.600}',
						background: '#00000000',
						borderColor: '{form.field.border.color}',
						color: '{surface.400}',
						hoverBackground: '{surface.100}',
						hoverBorderColor: '{form.field.border.color}',
						hoverColor: '{surface.500}',
					},
				},
				dark: {
					button: {
						activeBackground: '{surface.700}',
						activeBorderColor: '{form.field.border.color}',
						activeColor: '{surface.200}',
						background: '#00000000',
						borderColor: '{form.field.border.color}',
						color: '{surface.400}',
						hoverBackground: '{surface.800}',
						hoverBorderColor: '{form.field.border.color}',
						hoverColor: '{surface.300}',
					},
				},
			},
			button: {
				borderRadius: '{form.field.border.radius}',
				verticalPadding: '{form.field.padding.y}',
				width: '2.5rem',
			},
			root: {
				transitionDuration: '{transition.duration}',
			},
		},
		inputotp: {
			root: {
				gap: '0.5rem',
			},
			input: {
				lg: {
					width: '3rem',
				},
				sm: {
					width: '2rem',
				},
				width: '2.5rem',
			},
		},
		inputtext: {
			root: {
				background: '{form.field.background}',
				borderColor: '{form.field.border.color}',
				borderRadius: '{form.field.border.radius}',
				color: '{form.field.color}',
				disabledBackground: '{form.field.disabled.background}',
				disabledColor: '{form.field.disabled.color}',
				filledBackground: '{form.field.filled.background}',
				filledFocusBackground: '{form.field.filled.focus.background}',
				filledHoverBackground: '{form.field.filled.hover.background}',
				focusBorderColor: '{form.field.focus.border.color}',
				focusRing: {
					color: '{form.field.focus.ring.color}',
					offset: '{form.field.focus.ring.offset}',
					shadow: 'none',
					style: '{form.field.focus.ring.style}',
					width: '{form.field.focus.ring.width}',
				},
				hoverBorderColor: '{form.field.hover.border.color}',
				invalidBorderColor: '{form.field.invalid.border.color}',
				invalidPlaceholderColor: '{form.field.invalid.placeholder.color}',
				lg: {
					fontSize: '1.125rem',
					paddingX: '{form.field.lg.padding.x}',
					paddingY: '{form.field.lg.padding.y}',
				},
				paddingX: '{form.field.padding.x}',
				paddingY: '{form.field.padding.y}',
				placeholderColor: '{form.field.placeholder.color}',
				shadow: '0 1px 2px 0 #1212170d',
				sm: {
					fontSize: '0.875rem',
					paddingX: '{form.field.sm.padding.x}',
					paddingY: '{form.field.sm.padding.y}',
				},
				transitionDuration: '{form.field.transition.duration}',
			},
		},
		knob: {
			root: {
				focusRing: {
					color: '{focus.ring.color}',
					offset: '{focus.ring.offset}',
					shadow: 'none',
					style: '{focus.ring.style}',
					width: '{focus.ring.width}',
				},
				transitionDuration: '{transition.duration}',
			},
			range: {
				background: '{content.border.color}',
			},
			text: {
				color: '{text.muted.color}',
			},
			value: {
				background: '{primary.color}',
			},
		},
		listbox: {
			root: {
				background: '{form.field.background}',
				borderColor: '{form.field.border.color}',
				borderRadius: '{border.radius.xl}',
				color: '{form.field.color}',
				disabledBackground: '{form.field.disabled.background}',
				disabledColor: '{form.field.disabled.color}',
				invalidBorderColor: '{form.field.invalid.border.color}',
				shadow: '0 1px 2px 0 #1212170d',
				transitionDuration: '{form.field.transition.duration}',
			},
			checkmark: {
				color: '{list.option.color}',
				gutterEnd: '0.375rem',
				gutterStart: '-0.375rem',
			},
			emptyMessage: {
				padding: '{list.option.padding}',
			},
			list: {
				gap: '{list.gap}',
				header: {
					padding: '{list.header.padding}',
					'padding-bottom': '{list.header.padding.bottom}',
					'padding-left': '{list.header.padding.left}',
					'padding-right': '{list.header.padding.right}',
					'padding-top': '{list.header.padding.top}',
				},
				padding: '{list.padding}',
				'padding-x': '{list.padding.x}',
				'padding-y': '{list.padding.y}',
			},
			option: {
				borderRadius: '{list.option.border.radius}',
				color: '{list.option.color}',
				focusBackground: '{list.option.focus.background}',
				focusColor: '{list.option.focus.color}',
				group: {
					padding: {
						x: '{list.option.group.padding.x}',
						y: '{list.option.group.padding.y}',
					},
				},
				padding: '{list.option.padding}',
				'padding-x': '{list.option.padding.x}',
				'padding-y': '{list.option.padding.y}',
				selectedBackground: '{list.option.selected.background}',
				selectedColor: '{list.option.selected.color}',
				selectedFocusBackground: '{list.option.selected.focus.background}',
				selectedFocusColor: '{list.option.selected.focus.color}',
			},
			optionGroup: {
				background: '{list.option.group.background}',
				color: '{list.option.group.color}',
				fontWeight: '{list.option.group.font.weight}',
				padding: '{list.option.group.padding}',
			},
			colorScheme: {
				light: {
					option: {
						stripedBackground: '{surface.50}',
					},
				},
				dark: {
					option: {
						stripedBackground: '{surface.900}',
					},
				},
			},
		},
		megamenu: {
			root: {
				background: '{card.background}',
				borderColor: '{content.border.color}',
				borderRadius: '{content.border.radius}',
				color: '{content.color}',
				gap: '0.5rem',
				horizontalOrientation: {
					gap: '0.5rem',
					padding: '0.5rem 0.75rem',
				},
				transitionDuration: '{transition.duration}',
				verticalOrientation: {
					gap: '{navigation.list.gap}',
					padding: '{navigation.list.padding}',
				},
			},
			baseItem: {
				borderRadius: '{content.border.radius}',
				padding: '{navigation.item.padding}',
			},
			extend: {
				base: {
					item: {
						padding: {
							x: '{navigation.item.padding.x}',
							y: '{navigation.item.padding.y}',
						},
					},
				},
				horizontal: {
					orientation: {
						padding: {
							x: '0.75rem',
							y: '0.5rem',
						},
					},
				},
				vertical: {
					orientation: {
						padding: {
							x: '{navigation.list.padding.x}',
							y: '{navigation.list.padding.y}',
						},
					},
				},
			},
			item: {
				activeBackground: '{navigation.item.active.background}',
				activeColor: '{navigation.item.active.color}',
				borderRadius: '{navigation.item.border.radius}',
				color: '{navigation.item.color}',
				focusBackground: '{navigation.item.focus.background}',
				focusColor: '{navigation.item.focus.color}',
				gap: '{navigation.item.gap}',
				icon: {
					activeColor: '{navigation.item.icon.active.color}',
					color: '{navigation.item.icon.color}',
					focusColor: '{navigation.item.icon.focus.color}',
				},
				padding: '{navigation.item.padding}',
				'padding-x': '{navigation.item.padding.x}',
				'padding-y': '{navigation.item.padding.y}',
			},
			mobileButton: {
				borderRadius: '0.875rem',
				color: '{text.muted.color}',
				focusRing: {
					color: '{focus.ring.color}',
					offset: '{focus.ring.offset}',
					shadow: 'none',
					style: '{focus.ring.style}',
					width: '{focus.ring.width}',
				},
				hoverBackground: '{content.hover.background}',
				hoverColor: '{text.hover.muted.color}',
				size: '1.75rem',
			},
			overlay: {
				background: '{content.background}',
				borderColor: '{content.border.color}',
				borderRadius: '{border.radius.xl}',
				color: '{content.color}',
				gap: '0.5rem',
				padding: '0',
				shadow: '0 8px 24px -5px #0000001a',
			},
			separator: {
				borderColor: '{content.border.color}',
			},
			submenu: {
				gap: '{navigation.list.gap}',
				label: {
					padding: {
						x: '{navigation.submenu.label.padding.x}',
						y: '{navigation.submenu.label.padding.y}',
					},
				},
				padding: '{navigation.list.padding}',
				'padding-x': '{navigation.list.padding.x}',
				'padding-y': '{navigation.list.padding.y}',
			},
			submenuIcon: {
				activeColor: '{navigation.submenu.icon.active.color}',
				color: '{navigation.submenu.icon.color}',
				focusColor: '{navigation.submenu.icon.focus.color}',
				size: '{navigation.submenu.icon.size}',
			},
			submenuLabel: {
				background: '{navigation.submenu.label.background}',
				color: '{navigation.submenu.label.color}',
				fontWeight: '{navigation.submenu.label.font.weight}',
				padding: '{navigation.submenu.label.padding}',
			},
		},
		menu: {
			root: {
				background: '{content.background}',
				borderColor: '{content.border.color}',
				borderRadius: '{content.border.radius}',
				color: '{content.color}',
				shadow: '0 1px 2px -1px #0000001a, 0 1px 3px 0 #0000001a',
				transitionDuration: '{transition.duration}',
			},
			item: {
				borderRadius: '{navigation.item.border.radius}',
				color: '{navigation.item.color}',
				focusBackground: '{navigation.item.focus.background}',
				focusColor: '{navigation.item.focus.color}',
				gap: '{navigation.item.gap}',
				icon: {
					color: '{navigation.item.icon.color}',
					focusColor: '{navigation.item.icon.focus.color}',
				},
				padding: '{navigation.item.padding}',
				'padding-x': '{navigation.item.padding.x}',
				'padding-y': '{navigation.item.padding.y}',
			},
			list: {
				gap: '{navigation.list.gap}',
				padding: '{navigation.list.padding}',
				'padding-x': '{navigation.list.padding.x}',
				'padding-y': '{navigation.list.padding.y}',
			},
			separator: {
				borderColor: '{content.border.color}',
			},
			submenuLabel: {
				background: '{navigation.submenu.label.background}',
				color: '{navigation.submenu.label.color}',
				fontWeight: '{navigation.submenu.label.font.weight}',
				padding: '{navigation.submenu.label.padding}',
			},
			extend: {
				submenu: {
					label: {
						padding: {
							x: '{navigation.submenu.label.padding.x}',
							y: '{navigation.submenu.label.padding.y}',
						},
					},
				},
			},
		},
		menubar: {
			root: {
				background: '{surface.0}',
				borderColor: '{content.border.color}',
				borderRadius: '{content.border.radius}',
				color: '{content.color}',
				gap: '0.5rem',
				padding: '0.5rem 0.75rem',
				transitionDuration: '{transition.duration}',
			},
			baseItem: {
				borderRadius: '{content.border.radius}',
				padding: '{navigation.item.padding}',
			},
			extend: {
				base: {
					item: {
						padding: {
							x: '{navigation.item.padding.x}',
							y: '{navigation.item.padding.y}',
						},
					},
				},
				padding: {
					x: '0.75rem',
					y: '0.5rem',
				},
			},
			item: {
				activeBackground: '{navigation.item.active.background}',
				activeColor: '{navigation.item.active.color}',
				borderRadius: '{navigation.item.border.radius}',
				color: '{navigation.item.color}',
				focusBackground: '{navigation.item.focus.background}',
				focusColor: '{navigation.item.focus.color}',
				gap: '{navigation.item.gap}',
				icon: {
					activeColor: '{navigation.item.icon.active.color}',
					color: '{navigation.item.icon.color}',
					focusColor: '{navigation.item.icon.focus.color}',
				},
				padding: '{navigation.item.padding}',
				'padding-x': '{navigation.item.padding.x}',
				'padding-y': '{navigation.item.padding.y}',
			},
			mobileButton: {
				borderRadius: '0.875rem',
				color: '{text.muted.color}',
				focusRing: {
					color: '{focus.ring.color}',
					offset: '{focus.ring.offset}',
					shadow: 'none',
					style: '{focus.ring.style}',
					width: '{focus.ring.width}',
				},
				hoverBackground: '{content.hover.background}',
				hoverColor: '{text.hover.muted.color}',
				size: '1.75rem',
			},
			separator: {
				borderColor: '{content.border.color}',
			},
			submenu: {
				background: '{content.background}',
				borderColor: '{content.border.color}',
				borderRadius: '{content.border.radius}',
				gap: '{navigation.list.gap}',
				icon: {
					activeColor: '{navigation.submenu.icon.active.color}',
					color: '{navigation.submenu.icon.color}',
					focusColor: '{navigation.submenu.icon.focus.color}',
					size: '{navigation.submenu.icon.size}',
				},
				mobileIndent: '1rem',
				padding: '{navigation.list.padding}',
				'padding-x': '{navigation.list.padding.x}',
				'padding-y': '{navigation.list.padding.y}',
				shadow: '0 2px 4px -2px #0000001a, 0 4px 6px -1px #0000001a',
			},
		},
		message: {
			root: {
				borderRadius: '{content.border.radius}',
				borderWidth: '1px',
				transitionDuration: '{transition.duration}',
			},
			closeButton: {
				borderRadius: '0.875rem',
				focusRing: {
					offset: '{focus.ring.offset}',
					style: '{focus.ring.style}',
					width: '{focus.ring.width}',
				},
				height: '1.75rem',
				width: '1.75rem',
			},
			closeIcon: {
				lg: {
					size: '1.125rem',
				},
				size: '1rem',
				sm: {
					size: '0.875rem',
				},
			},
			content: {
				gap: '0.5rem',
				lg: {
					padding: '0.625rem 0.875rem',
					'padding-x': '0.875rem',
					'padding-y': '0.625rem',
				},
				padding: '0.5rem 0.75rem',
				'padding-x': '0.75rem',
				'padding-y': '0.5rem',
				sm: {
					padding: '0.375rem 0.625rem',
					'padding-x': '0.625rem',
					'padding-y': '0.375rem',
				},
			},
			colorScheme: {
				light: {
					contrast: {
						background: '{surface.900}',
						borderColor: '{surface.950}',
						closeButton: {
							focusRing: {
								color: '{surface.50}',
							},
							hoverBackground: '{surface.800}',
						},
						color: '{surface.50}',
						outlined: {
							borderColor: '{surface.950}',
							color: '{surface.950}',
						},
						simple: {
							color: '{surface.950}',
						},
					},
					error: {
						background: '{red.100}',
						borderColor: '{red.200}',
						closeButton: {
							focusRing: {
								color: '{red.950}',
							},
							hoverBackground: '{message.error.border.color}',
						},
						color: '{red.950}',
						outlined: {
							borderColor: '{red.200}',
							color: '{red.800}',
						},
						simple: {
							color: '{red.800}',
						},
					},
					info: {
						background: '{cyan.200}',
						borderColor: '{cyan.300}',
						closeButton: {
							focusRing: {
								color: '{blue.950}',
							},
							hoverBackground: '{message.info.border.color}',
						},
						color: '{blue.950}',
						outlined: {
							borderColor: '{blue.200}',
							color: '{blue.800}',
						},
						simple: {
							color: '{blue.800}',
						},
					},
					secondary: {
						background: '{zinc.50}',
						borderColor: '{zinc.200}',
						closeButton: {
							focusRing: {
								color: '{surface.600}',
							},
							hoverBackground: '{zinc.200}',
						},
						color: '{surface.950}',
						outlined: {
							borderColor: '{zinc.200}',
							color: '{zinc.800}',
						},
						simple: {
							color: '{zinc.800}',
						},
					},
					success: {
						background: '{teal.100}',
						borderColor: '{teal.200}',
						closeButton: {
							focusRing: {
								color: '{teal.950}',
							},
							hoverBackground: '{message.success.border.color}',
						},
						color: '{teal.950}',
						outlined: {
							borderColor: '{teal.200}',
							color: '{teal.800}',
						},
						simple: {
							color: '{teal.800}',
						},
					},
					warn: {
						background: '{amber.100}',
						borderColor: '{amber.200}',
						closeButton: {
							focusRing: {
								color: '{amber.950}',
							},
							hoverBackground: '{message.warn.border.color}',
						},
						color: '{amber.950}',
						outlined: {
							borderColor: '{amber.200}',
							color: '{amber.800}',
						},
						simple: {
							color: '{amber.800}',
						},
					},
				},
				dark: {
					contrast: {
						background: '{surface.0}',
						borderColor: '{surface.100}',
						closeButton: {
							focusRing: {
								color: '{message.secondary.outlined.border.color}',
							},
							hoverBackground: '{surface.100}',
						},
						color: '{surface.950}',
						outlined: {
							borderColor: '{surface.0}',
							color: '{surface.0}',
						},
						simple: {
							color: '{surface.0}',
						},
					},
					error: {
						background: '{red.300}',
						borderColor: '{red.200}',
						closeButton: {
							focusRing: {
								color: '{message.error.outlined.border.color}',
							},
							hoverBackground: '{red.300}',
						},
						color: '{red.950}',
						outlined: {
							borderColor: '{red.200}',
							color: '{red.400}',
						},
						simple: {
							color: '{red.400}',
						},
					},
					info: {
						background: '{cyan.500}',
						borderColor: '{cyan.200}',
						closeButton: {
							focusRing: {
								color: '{cyan.600}',
							},
							hoverBackground: '{cyan.600}',
						},
						color: '{blue.950}',
						outlined: {
							borderColor: '{cyan.400}',
							color: '{cyan.400}',
						},
						simple: {
							color: '{cyan.400}',
						},
					},
					secondary: {
						background: '{zinc.50}',
						borderColor: '{zinc.200}',
						closeButton: {
							focusRing: {
								color: '{zinc.200}',
							},
							hoverBackground: '{zinc.300}',
						},
						color: '{zinc.800}',
						outlined: {
							borderColor: '{zinc.200}',
							color: '{zinc.300}',
						},
						simple: {
							color: '{zinc.300}',
						},
					},
					success: {
						background: '{teal.400}',
						borderColor: '{teal.200}',
						closeButton: {
							focusRing: {
								color: '{message.success.outlined.border.color}',
							},
							hoverBackground: '{teal.600}',
						},
						color: '{teal.950}',
						outlined: {
							borderColor: '{teal.600}',
							color: '{teal.500}',
						},
						simple: {
							color: '{teal.400}',
						},
					},
					warn: {
						background: '{amber.300}',
						borderColor: '{amber.200}',
						closeButton: {
							focusRing: {
								color: '{message.warn.outlined.border.color}',
							},
							hoverBackground: '{amber.600}',
						},
						color: '{amber.950}',
						outlined: {
							borderColor: '{amber.400}',
							color: '{amber.400}',
						},
						simple: {
							color: '{amber.400}',
						},
					},
				},
			},
			contrast: {
				closeButton: {
					focusRing: {
						shadow: 'none',
					},
				},
				shadow: '0 4px 8px 0 #0000010a',
			},
			error: {
				closeButton: {
					focusRing: {
						shadow: 'none',
					},
				},
				outlined: {
					background: 'light-dark({surface.0}, #e8446b26)',
				},
				shadow: '0 4px 8px 0 #0a03030a',
			},
			icon: {
				lg: {
					size: '1.25rem',
				},
				size: '1.125rem',
				sm: {
					size: '1rem',
				},
			},
			info: {
				closeButton: {
					focusRing: {
						shadow: 'none',
					},
				},
				outlined: {
					background: 'light-dark({surface.0}, #61d1ed26)',
				},
				shadow: '0 4px 8px 0 #02050a0a',
			},
			outlined: {
				root: {
					borderWidth: '1px',
				},
			},
			secondary: {
				closeButton: {
					focusRing: {
						shadow: 'none',
					},
				},
				outlined: {
					background: 'light-dark({surface.0}, #ffffff00)',
				},
				shadow: '0 4px 8px 0 #0405060a',
			},
			simple: {
				content: {
					padding: '0',
				},
			},
			success: {
				closeButton: {
					focusRing: {
						shadow: 'none',
					},
				},
				outlined: {
					background: 'light-dark({surface.0}, #4fd2b326)',
				},
				shadow: '0 4px 8px 0 #0108040a',
			},
			text: {
				fontSize: '1rem',
				fontWeight: '500',
				lg: {
					fontSize: '1.125rem',
				},
				sm: {
					fontSize: '1rem',
				},
			},
			warn: {
				closeButton: {
					focusRing: {
						shadow: 'none',
					},
				},
				outlined: {
					background: 'light-dark({surface.0}, #ffc87026)',
				},
				shadow: '0 4px 8px 0 #0907000a',
			},
		},
		metergroup: {
			root: {
				borderRadius: '{content.border.radius}',
				gap: '1rem',
			},
			label: {
				gap: '0.5rem',
			},
			labelIcon: {
				size: '1rem',
			},
			labelList: {
				horizontalGap: '1rem',
				verticalGap: '0.5rem',
			},
			labelMarker: {
				size: '0.5rem',
			},
			meters: {
				background: '{content.border.color}',
				size: '0.5rem',
			},
		},
		multiselect: {
			root: {
				background: '{form.field.background}',
				borderColor: '{form.field.border.color}',
				borderRadius: '{form.field.border.radius}',
				color: '{form.field.color}',
				disabledBackground: '{form.field.disabled.background}',
				disabledColor: '{form.field.disabled.color}',
				filledBackground: '{form.field.filled.background}',
				filledFocusBackground: '{form.field.filled.focus.background}',
				filledHoverBackground: '{form.field.filled.hover.background}',
				focusBorderColor: '{form.field.focus.border.color}',
				focusRing: {
					color: '{form.field.focus.ring.color}',
					offset: '{form.field.focus.ring.offset}',
					shadow: 'none',
					style: '{form.field.focus.ring.style}',
					width: '{form.field.focus.ring.width}',
				},
				hoverBorderColor: '{form.field.hover.border.color}',
				invalidBorderColor: '{form.field.invalid.border.color}',
				invalidPlaceholderColor: '{form.field.invalid.placeholder.color}',
				lg: {
					fontSize: '{form.field.lg.font.size}',
					paddingX: '{form.field.lg.padding.x}',
					paddingY: '{form.field.lg.padding.y}',
				},
				paddingX: '{form.field.padding.x}',
				paddingY: '{form.field.padding.y}',
				placeholderColor: '{form.field.placeholder.color}',
				shadow: '0 1px 2px 0 #1212170d',
				sm: {
					fontSize: '{form.field.sm.font.size}',
					paddingX: '{form.field.sm.padding.x}',
					paddingY: '{form.field.sm.padding.y}',
				},
				transitionDuration: '{form.field.transition.duration}',
			},
			chip: {
				borderRadius: '{border.radius.sm}',
			},
			clearIcon: {
				color: '{form.field.icon.color}',
			},
			dropdown: {
				color: '{form.field.icon.color}',
				width: '2.5rem',
			},
			emptyMessage: {
				padding: '{list.option.padding}',
			},
			extend: {
				filtered: {
					border: {
						color: '{teal.500}',
					},
				},
			},
			list: {
				gap: '{list.gap}',
				header: {
					padding: '{list.header.padding}',
					'padding-bottom': '{list.header.padding.bottom}',
					'padding-left': '{list.header.padding.left}',
					'padding-right': '{list.header.padding.right}',
					'padding-top': '{list.header.padding.top}',
				},
				padding: '{list.padding}',
				'padding-x': '{list.padding.x}',
				'padding-y': '{list.padding.y}',
			},
			option: {
				borderRadius: '{list.option.border.radius}',
				color: '{list.option.color}',
				focusBackground: '{list.option.focus.background}',
				focusColor: '{list.option.focus.color}',
				gap: '0.5rem',
				group: {
					padding: {
						x: '{list.option.group.padding.x}',
						y: '{list.option.group.padding.y}',
					},
				},
				padding: '{list.option.padding}',
				'padding-x': '{list.option.padding.x}',
				'padding-y': '{list.option.padding.y}',
				selectedBackground: '{list.option.selected.background}',
				selectedColor: '{list.option.selected.color}',
				selectedFocusBackground: '{list.option.selected.focus.background}',
				selectedFocusColor: '{list.option.selected.focus.color}',
			},
			optionGroup: {
				background: '{list.option.group.background}',
				color: '{list.option.group.color}',
				fontWeight: '{list.option.group.font.weight}',
				padding: '{list.option.group.padding}',
			},
			overlay: {
				background: '{overlay.select.background}',
				borderColor: '{overlay.select.border.color}',
				borderRadius: '{overlay.select.border.radius}',
				color: '{overlay.select.color}',
				shadow: '0 1px 2px -1px #0000001a, 0 1px 3px 0 #0000001a',
			},
		},
		orderlist: {
			controls: {
				gap: '0.5rem',
			},
			root: {
				gap: '1.125rem',
			},
		},
		organizationchart: {
			connector: {
				borderRadius: '{content.border.radius}',
				color: '{content.border.color}',
				height: '24px',
			},
			root: {
				gutter: '0.75rem',
				transitionDuration: '{transition.duration}',
			},
			node: {
				background: '{content.background}',
				borderColor: '{content.border.color}',
				borderRadius: '{content.border.radius}',
				color: '{content.color}',
				hoverBackground: '{content.hover.background}',
				hoverColor: '{content.hover.color}',
				padding: '0.75rem 1rem',
				'padding-x': '1rem',
				'padding-y': '0.75rem',
				selectedBackground: '{highlight.background}',
				selectedColor: '{highlight.color}',
				toggleablePadding: '0.75rem 1rem 1.25rem',
				toggleable: {
					padding: {
						bottom: '1.25rem',
						left: '1rem',
						right: '1rem',
						top: '0.75rem',
					},
				},
			},
			nodeToggleButton: {
				background: '{content.background}',
				borderColor: '{content.border.color}',
				borderRadius: '0.75rem',
				color: '{text.muted.color}',
				focusRing: {
					color: '{focus.ring.color}',
					offset: '{focus.ring.offset}',
					shadow: 'none',
					style: '{focus.ring.style}',
					width: '{focus.ring.width}',
				},
				hoverBackground: '{content.hover.background}',
				hoverColor: '{text.color}',
				size: '1.5rem',
			},
		},
		overlaybadge: {
			root: {
				outline: {
					color: '{content.background}',
					width: '2px',
				},
			},
		},
		paginator: {
			root: {
				background: '{content.background}',
				borderRadius: '{content.border.radius}',
				color: '{content.color}',
				gap: '0.25rem',
				padding: '0.5rem 1rem',
				transitionDuration: '{transition.duration}',
			},
			currentPageReport: {
				color: '{text.muted.color}',
			},
			jumpToPageInput: {
				maxWidth: '2.5rem',
			},
			navButton: {
				background: '#00000000',
				borderRadius: '1.25rem',
				color: '{text.muted.color}',
				focusRing: {
					color: '{focus.ring.color}',
					offset: '{focus.ring.offset}',
					shadow: 'none',
					style: '{focus.ring.style}',
					width: '{focus.ring.width}',
				},
				height: '2.5rem',
				hoverBackground: '{content.hover.background}',
				hoverColor: '{text.hover.muted.color}',
				selectedBackground: '{highlight.background}',
				selectedColor: '{highlight.color}',
				width: '2.5rem',
			},
			extend: {
				padding: {
					x: '1rem',
					y: '0.5rem',
				},
			},
		},
		panel: {
			root: {
				background: '{card.background}',
				borderColor: '{content.border.color}',
				borderRadius: '{content.border.radius}',
				color: '{content.color}',
			},
			content: {
				padding: '0 1.125rem 1.125rem',
				'padding-bottom': '1.125rem',
				'padding-left': '1.125rem',
				'padding-right': '1.125rem',
				'padding-top': '0rem',
			},
			footer: {
				padding: '0 1.125rem 1.125rem',
				'padding-bottom': '1.125rem',
				'padding-left': '1.125rem',
				'padding-right': '1.125rem',
				'padding-top': '0rem',
			},
			header: {
				background: '#00000000',
				borderColor: '{content.border.color}',
				borderRadius: '0',
				borderWidth: '0',
				border: {
					width: {
						bottom: '0px',
						left: '0px',
						right: '0px',
						top: '0px',
					},
				},
				color: '{text.color}',
				padding: '1.125rem',
			},
			title: {
				fontWeight: '600',
			},
			toggleableHeader: {
				padding: '0.375rem 1.125rem',
			},
			extend: {
				toggleable: {
					header: {
						padding: {
							x: '1.125rem',
							y: '0.375rem',
						},
					},
				},
			},
		},
		panelmenu: {
			root: {
				gap: '0.25rem',
				transitionDuration: '{transition.duration}',
			},
			item: {
				borderRadius: '{border.radius.md}',
				color: '{navigation.item.color}',
				focusBackground: '{navigation.item.focus.background}',
				focusColor: '{navigation.item.focus.color}',
				gap: '0.5rem',
				icon: {
					color: '{navigation.item.icon.color}',
					focusColor: '{navigation.item.icon.focus.color}',
				},
				padding: '0.75rem',
				'padding-x': '{navigation.item.padding.x}',
				'padding-y': '{scale.0-75}',
			},
			panel: {
				background: '{transparent}',
				borderColor: '{content.border.color}',
				borderRadius: '{content.border.radius}',
				borderWidth: '0',
				color: '{content.color}',
				first: {
					borderWidth: '0',
					topBorderRadius: '{content.border.radius}',
				},
				last: {
					borderWidth: '0',
					bottomBorderRadius: '{content.border.radius}',
				},
				padding: '0.25rem',
				'padding-x': '{scale.0-25}',
				'padding-y': '{scale.0-25}',
			},
			submenuIcon: {
				color: '{navigation.submenu.icon.color}',
				focusColor: '{navigation.submenu.icon.focus.color}',
			},
			submenu: {
				indent: '1.5rem',
			},
		},
		password: {
			content: {
				gap: '0.5rem',
			},
			icon: {
				color: '{form.field.icon.color}',
			},
			meter: {
				background: '{content.border.color}',
				borderRadius: '{content.border.radius}',
				height: '0.75rem',
			},
			overlay: {
				background: '{overlay.popover.background}',
				borderColor: '{overlay.popover.border.color}',
				borderRadius: '{overlay.popover.border.radius}',
				color: '{overlay.popover.color}',
				padding: '{overlay.popover.padding}',
				shadow: '0 2px 4px -2px #0000001a, 0 4px 6px -1px #0000001a',
			},
			colorScheme: {
				light: {
					strength: {
						mediumBackground: '{amber.500}',
						strongBackground: '{teal.600}',
						weakBackground: '{red.500}',
					},
				},
				dark: {
					strength: {
						mediumBackground: '{amber.400}',
						strongBackground: '{teal.500}',
						weakBackground: '{red.400}',
					},
				},
			},
		},
		picklist: {
			controls: {
				gap: '0.5rem',
			},
			root: {
				gap: '1.125rem',
			},
		},
		popover: {
			root: {
				arrowOffset: '1.25rem',
				background: '{overlay.popover.background}',
				borderColor: '{overlay.popover.border.color}',
				borderRadius: '{overlay.popover.border.radius}',
				color: '{overlay.popover.color}',
				gutter: '10px',
				shadow: '0 2px 4px -2px #0000001a, 0 4px 6px -1px #0000001a',
			},
			content: {
				padding: '{overlay.popover.padding}',
			},
		},
		progressbar: {
			root: {
				background: '{content.border.color}',
				borderRadius: '{content.border.radius}',
				height: '1.25rem',
			},
			label: {
				color: '{primary.contrast.color}',
				fontSize: '0.75rem',
				fontWeight: '600',
			},
			value: {
				background: '{primary.color}',
			},
		},
		progressspinner: {
			colorScheme: {
				light: {
					root: {
						colorFour: '{yellow.500}',
						colorOne: '{red.500}',
						colorThree: '{teal.600}',
						colorTwo: '{primary.color}',
					},
				},
				dark: {
					root: {
						colorFour: '{yellow.400}',
						colorOne: '{red.400}',
						colorThree: '{teal.500}',
						colorTwo: '{primary.color}',
					},
				},
			},
		},
		radiobutton: {
			root: {
				background: '{form.field.background}',
				borderColor: '{form.field.border.color}',
				checkedBackground: '{teal.500}',
				checkedBorderColor: '{teal.500}',
				checkedDisabledBorderColor: '{form.field.border.color}',
				checkedFocusBorderColor: '{teal.500}',
				checkedHoverBackground: '{teal.300}',
				checkedHoverBorderColor: '{teal.300}',
				disabledBackground: '{form.field.disabled.background}',
				filledBackground: '{form.field.filled.background}',
				focusBorderColor: '{form.field.border.color}',
				focusRing: {
					color: '{teal.500}',
					offset: '{focus.ring.offset}',
					shadow: 'none',
					style: '{focus.ring.style}',
					width: '{focus.ring.width}',
				},
				height: '1.25rem',
				hoverBorderColor: '{form.field.hover.border.color}',
				invalidBorderColor: '{form.field.invalid.border.color}',
				lg: {
					height: '1.5rem',
					width: '1.5rem',
				},
				shadow: '0 1px 2px 0 #1212170d',
				sm: {
					height: '1rem',
					width: '1rem',
				},
				transitionDuration: '{form.field.transition.duration}',
				width: '1.25rem',
			},
			icon: {
				checkedColor: '{teal.950}',
				checkedHoverColor: '{teal.950}',
				disabledColor: '{teal.100}',
				lg: {
					size: '1rem',
				},
				size: '0.75rem',
				sm: {
					size: '0.5rem',
				},
			},
		},
		rating: {
			root: {
				focusRing: {
					color: '{focus.ring.color}',
					offset: '{focus.ring.offset}',
					shadow: 'none',
					style: '{focus.ring.style}',
					width: '{focus.ring.width}',
				},
				gap: '0.25rem',
				transitionDuration: '{transition.duration}',
			},
			icon: {
				activeColor: '{primary.color}',
				color: '{text.muted.color}',
				hoverColor: '{primary.color}',
				size: '1rem',
			},
		},
		ripple: {
			colorScheme: {
				light: {
					root: {
						background: 'rgba(0, 0, 0, 0.1)',
					},
				},
				dark: {
					root: {
						background: 'rgba(255, 255, 255, 0.4)',
					},
				},
			},
		},
		scrollpanel: {
			colorScheme: {
				light: {
					bar: {
						background: '{surface.100}',
					},
				},
				dark: {
					bar: {
						background: '{surface.800}',
					},
				},
			},
			bar: {
				borderRadius: '{border.radius.sm}',
				focusRing: {
					color: '{focus.ring.color}',
					offset: '{focus.ring.offset}',
					shadow: 'none',
					style: '{focus.ring.style}',
					width: '{focus.ring.width}',
				},
				size: '9px',
			},
			root: {
				transitionDuration: '{transition.duration}',
			},
		},
		select: {
			root: {
				background: '{form.field.background}',
				borderColor: '{form.field.border.color}',
				borderRadius: '{form.field.border.radius}',
				color: '{form.field.color}',
				disabledBackground: '{form.field.disabled.background}',
				disabledColor: '{form.field.disabled.color}',
				filledBackground: '{form.field.filled.background}',
				filledFocusBackground: '{form.field.filled.focus.background}',
				filledHoverBackground: '{form.field.filled.hover.background}',
				focusBorderColor: '{form.field.focus.border.color}',
				focusRing: {
					color: '{form.field.focus.ring.color}',
					offset: '{form.field.focus.ring.offset}',
					shadow: 'none',
					style: '{form.field.focus.ring.style}',
					width: '{form.field.focus.ring.width}',
				},
				hoverBorderColor: '{form.field.hover.border.color}',
				invalidBorderColor: '{form.field.invalid.border.color}',
				invalidPlaceholderColor: '{form.field.invalid.placeholder.color}',
				lg: {
					fontSize: '{form.field.lg.font.size}',
					paddingX: '{form.field.lg.padding.x}',
					paddingY: '{form.field.lg.padding.y}',
				},
				paddingX: '{form.field.padding.x}',
				paddingY: '{form.field.padding.y}',
				placeholderColor: '{form.field.placeholder.color}',
				shadow: '0 1px 2px 0 #1212170d',
				sm: {
					fontSize: '{form.field.sm.font.size}',
					paddingX: '{form.field.sm.padding.x}',
					paddingY: '{form.field.sm.padding.y}',
				},
				transitionDuration: '{form.field.transition.duration}',
			},
			checkmark: {
				color: '{list.option.color}',
				gutterEnd: '0.375rem',
				gutterStart: '-0.375rem',
			},
			clearIcon: {
				color: '{form.field.icon.color}',
			},
			dropdown: {
				color: '{form.field.icon.color}',
				width: '2.5rem',
			},
			emptyMessage: {
				padding: '{list.option.padding}',
			},
			list: {
				gap: '{list.gap}',
				header: {
					padding: '{list.header.padding}',
					'padding-bottom': '{list.header.padding.bottom}',
					'padding-left': '{list.header.padding.left}',
					'padding-right': '{list.header.padding.right}',
					'padding-top': '{list.header.padding.top}',
				},
				padding: '{list.padding}',
				'padding-x': '{list.padding.x}',
				'padding-y': '{list.padding.y}',
			},
			option: {
				borderRadius: '{list.option.border.radius}',
				color: '{list.option.color}',
				focusBackground: '{list.option.focus.background}',
				focusColor: '{list.option.focus.color}',
				group: {
					padding: {
						x: '{list.option.group.padding.x}',
						y: '{list.option.group.padding.y}',
					},
				},
				padding: '{list.option.padding}',
				'padding-x': '{list.option.padding.x}',
				'padding-y': '{list.option.padding.y}',
				selectedBackground: '{list.option.selected.background}',
				selectedColor: '{list.option.selected.color}',
				selectedFocusBackground: '{list.option.selected.focus.background}',
				selectedFocusColor: '{list.option.selected.focus.color}',
			},
			optionGroup: {
				background: '{list.option.group.background}',
				color: '{list.option.group.color}',
				fontWeight: '{list.option.group.font.weight}',
				padding: '{list.option.group.padding}',
			},
			overlay: {
				background: '{overlay.select.background}',
				borderColor: '{overlay.select.border.color}',
				borderRadius: '{overlay.select.border.radius}',
				color: '{overlay.select.color}',
				shadow: '0 1px 2px -1px #0000001a, 0 1px 3px 0 #0000001a',
			},
		},
		selectbutton: {
			root: {
				borderRadius: '{form.field.border.radius}',
			},
			colorScheme: {
				light: {
					root: {
						invalidBorderColor: '{form.field.invalid.border.color}',
					},
				},
				dark: {
					root: {
						invalidBorderColor: '{form.field.invalid.border.color}',
					},
				},
			},
		},
		skeleton: {
			colorScheme: {
				light: {
					root: {
						animationBackground: 'rgba(255, 255, 255, 0.4)',
						background: '{surface.200}',
					},
				},
				dark: {
					root: {
						animationBackground: 'rgba(255, 255, 255, 0.1)',
						background: '{stone.400}',
					},
				},
			},
			root: {
				borderRadius: '{content.border.radius}',
			},
			extend: {
				color: '{surface.0}',
			},
		},
		slider: {
			handle: {
				background: '{content.border.color}',
				borderRadius: '10px',
				content: {
					borderRadius: '8px',
					height: '16px',
					hoverBackground: '{content.background}',
					shadow: '0 1px 1px 0 #00000024, 0 1px 0 0 #00000014',
					width: '16px',
				},
				focusRing: {
					color: '{focus.ring.color}',
					offset: '{focus.ring.offset}',
					shadow: 'none',
					style: '{focus.ring.style}',
					width: '{focus.ring.width}',
				},
				height: '20px',
				hoverBackground: '{content.border.color}',
				width: '20px',
			},
			colorScheme: {
				light: {
					handle: {
						content: {
							background: '{surface.0}',
						},
					},
				},
				dark: {
					handle: {
						content: {
							background: '{surface.950}',
						},
					},
				},
			},
			range: {
				background: '{primary.color}',
			},
			track: {
				background: '{content.border.color}',
				borderRadius: '{content.border.radius}',
				size: '3px',
			},
			root: {
				transitionDuration: '{transition.duration}',
			},
		},
		speeddial: {
			root: {
				gap: '0.5rem',
				transitionDuration: '{transition.duration}',
			},
		},
		splitbutton: {
			root: {
				borderRadius: '{form.field.border.radius}',
				raisedShadow: '0 1px 5px 0 #0000001f, 0 2px 2px 0 #00000024, 0 3px 1px -2px #00000033',
				roundedBorderRadius: '2rem',
			},
		},
		splitter: {
			root: {
				background: '{content.background}',
				borderColor: '{content.border.color}',
				color: '{content.color}',
				transitionDuration: '{transition.duration}',
			},
			gutter: {
				background: '{content.border.color}',
			},
			handle: {
				background: '#00000000',
				borderRadius: '{content.border.radius}',
				focusRing: {
					color: '{focus.ring.color}',
					offset: '{focus.ring.offset}',
					shadow: 'none',
					style: '{focus.ring.style}',
					width: '{focus.ring.width}',
				},
				size: '24px',
			},
		},
		stepper: {
			separator: {
				activeBackground: '{primary.color}',
				background: '{content.border.color}',
				margin: '0 0 0 1rem',
				'margin-bottom': '0rem',
				'margin-left': '1rem',
				'margin-right': '0rem',
				'margin-top': '0rem',
				size: '2px',
			},
			step: {
				gap: '1rem',
				padding: '0.5rem',
			},
			stepHeader: {
				borderRadius: '{content.border.radius}',
				focusRing: {
					color: '{focus.ring.color}',
					offset: '{focus.ring.offset}',
					shadow: 'none',
					style: '{focus.ring.style}',
					width: '{focus.ring.width}',
				},
				gap: '0.5rem',
				padding: '0',
			},
			stepNumber: {
				activeBackground: '{content.background}',
				activeBorderColor: '{content.border.color}',
				activeColor: '{primary.color}',
				background: '{content.background}',
				borderColor: '{content.border.color}',
				borderRadius: '1rem',
				color: '{text.muted.color}',
				fontSize: '1.143rem',
				fontWeight: '500',
				shadow: '0 1px 1px 0 #0000001f, 0 1px 0 0 #0000000f',
				size: '2rem',
			},
			stepTitle: {
				activeColor: '{primary.color}',
				color: '{text.muted.color}',
				fontWeight: '500',
			},
			steppanel: {
				background: '{content.background}',
				color: '{content.color}',
				indent: '1rem',
				padding: '0',
			},
			steppanels: {
				padding: '0.875rem 0.5rem 1.125rem',
				'padding-bottom': '1.125rem',
				'padding-left': '0.5rem',
				'padding-right': '0.5rem',
				'padding-top': '0.875rem',
			},
			root: {
				transitionDuration: '{transition.duration}',
			},
		},
		tabs: {
			activeBar: {
				background: '{primary.color}',
				bottom: '-1px',
				height: '1px',
			},
			navButton: {
				background: '{content.background}',
				color: '{text.muted.color}',
				focusRing: {
					color: '{focus.ring.color}',
					offset: '-1px',
					shadow: 'none',
					style: '{focus.ring.style}',
					width: '{focus.ring.width}',
				},
				hoverColor: '{text.color}',
				shadow: '0 0 10px 40px color-mix(in srgb, {content.background} 60%, transparent)',
				width: '2.5rem',
			},
			tab: {
				activeBackground: '#00000000',
				activeBorderColor: '{primary.color}',
				activeColor: '{primary.color}',
				background: '#00000000',
				borderColor: '{content.border.color}',
				borderWidth: '0 0 1px 0',
				border: {
					width: {
						bottom: '1px',
						left: '0px',
						right: '0px',
						top: '0px',
					},
				},
				color: '{text.muted.color}',
				focusRing: {
					color: '{focus.ring.color}',
					offset: '-1px',
					shadow: 'none',
					style: '{focus.ring.style}',
					width: '{focus.ring.width}',
				},
				fontWeight: '600',
				gap: '0.5rem',
				hoverBackground: '#00000000',
				hoverBorderColor: '{content.border.color}',
				hoverColor: '{text.color}',
				margin: '0 0 -1px 0',
				'margin-bottom': '-1px',
				'margin-left': '0px',
				'margin-right': '0px',
				'margin-top': '0px',
				padding: '1rem 1.125rem',
				'padding-x': '1.125rem',
				'padding-y': '1rem',
			},
			tablist: {
				background: '{transparent}',
				borderColor: '{content.border.color}',
				borderWidth: '0 0 1px 0',
				border: {
					width: {
						bottom: '1px',
						left: '0px',
						right: '0px',
						top: '0px',
					},
				},
			},
			tabpanel: {
				background: '{transparent}',
				color: '{content.color}',
				focusRing: {
					color: '{focus.ring.color}',
					offset: '{focus.ring.offset}',
					shadow: 'none',
					style: '{focus.ring.style}',
					width: '{focus.ring.width}',
				},
				padding: '0.875rem 1.125rem 1.125rem',
				'padding-bottom': '1.125rem',
				'padding-left': '1.125rem',
				'padding-right': '1.125rem',
				'padding-top': '0.875rem',
			},
			root: {
				transitionDuration: '{transition.duration}',
			},
		},
		tag: {
			root: {
				borderRadius: '{content.border.radius}',
				fontSize: '0.875rem',
				fontWeight: '700',
				gap: '0.25rem',
				padding: '0.25rem 0.5rem',
				roundedBorderRadius: '{border.radius.xl}',
			},
			extend: {
				container: {
					background: 'light-dark(#00000000, #000000b2)',
				},
				danger: {
					border: {
						color: '{red.200}',
					},
				},
				info: {
					border: {
						color: 'light-dark({tag.info.color}, {sky.200})',
					},
				},
				padding: {
					x: '0.5rem',
					y: '0.25rem',
				},
				primary: {
					border: {
						color: '{tag.primary.color}',
					},
				},
				secondary: {
					border: {
						color: '{tag.secondary.color}',
					},
				},
				success: {
					border: {
						color: '{teal.200}',
					},
				},
				warn: {
					border: {
						color: '{amber.200}',
					},
				},
			},
			colorScheme: {
				light: {
					contrast: {
						background: '{surface.950}',
						color: '{carbon.100}',
					},
					danger: {
						background: '{red.100}',
						color: '{red.950}',
					},
					info: {
						background: '{sky.100}',
						color: '{sky.700}',
					},
					primary: {
						background: '{primary.100}',
						color: '{primary.700}',
					},
					secondary: {
						background: '{surface.0}',
						color: '{zinc.800}',
					},
					success: {
						background: '{teal.100}',
						color: '{teal.950}',
					},
					warn: {
						background: '{amber.100}',
						color: '{amber.950}',
					},
				},
				dark: {
					contrast: {
						background: '{carbon.100}',
						color: '{surface.950}',
					},
					danger: {
						background: '{red.300}',
						color: '{red.950}',
					},
					info: {
						background: '#0ea5e929',
						color: '{sky.300}',
					},
					primary: {
						background: '#c9d7f70d',
						color: '{primary.300}',
					},
					secondary: {
						background: '#ffffff00',
						color: '{zinc.100}',
					},
					success: {
						background: '{teal.400}',
						color: '{teal.950}',
					},
					warn: {
						background: '{amber.300}',
						color: '{amber.950}',
					},
				},
			},
			icon: {
				size: '0.75rem',
			},
		},
		terminal: {
			root: {
				background: '{form.field.background}',
				borderColor: '{form.field.border.color}',
				borderRadius: '{form.field.border.radius}',
				color: '{form.field.color}',
				height: '18rem',
				padding: '{form.field.padding.y} {form.field.padding.x}',
			},
			commandResponse: {
				margin: '2px 0',
			},
			extend: {
				command: {
					response: {
						margin: {
							x: '0px',
							y: '2px',
						},
					},
				},
				padding: {
					x: '{form.field.padding.x}',
					y: '{form.field.padding.y}',
				},
			},
			prompt: {
				gap: '0.25rem',
			},
		},
		textarea: {
			root: {
				background: '{form.field.background}',
				borderColor: '{form.field.border.color}',
				borderRadius: '{border.radius.xl}',
				color: '{form.field.color}',
				disabledBackground: '{form.field.disabled.background}',
				disabledColor: '{form.field.disabled.color}',
				filledBackground: '{form.field.filled.background}',
				filledFocusBackground: '{form.field.filled.focus.background}',
				filledHoverBackground: '{form.field.filled.hover.background}',
				focusBorderColor: '{form.field.focus.border.color}',
				focusRing: {
					color: '{form.field.focus.ring.color}',
					offset: '{form.field.focus.ring.offset}',
					shadow: 'none',
					style: '{form.field.focus.ring.style}',
					width: '{form.field.focus.ring.width}',
				},
				hoverBorderColor: '{form.field.hover.border.color}',
				invalidBorderColor: '{form.field.invalid.border.color}',
				invalidPlaceholderColor: '{form.field.invalid.placeholder.color}',
				lg: {
					fontSize: '{form.field.lg.font.size}',
					paddingX: '{form.field.lg.padding.x}',
					paddingY: '{form.field.lg.padding.y}',
				},
				paddingX: '{form.field.padding.x}',
				paddingY: '{form.field.padding.y}',
				placeholderColor: '{form.field.placeholder.color}',
				shadow: '0 1px 2px 0 #1212170d',
				sm: {
					fontSize: '{form.field.sm.font.size}',
					paddingX: '{form.field.sm.padding.x}',
					paddingY: '{form.field.sm.padding.y}',
				},
				transitionDuration: '{form.field.transition.duration}',
			},
		},
		tieredmenu: {
			root: {
				background: '{content.background}',
				borderColor: '{content.border.color}',
				borderRadius: '{content.border.radius}',
				color: '{content.color}',
				shadow: '0 2px 4px -2px #0000001a, 0 4px 6px -1px #0000001a',
				transitionDuration: '{transition.duration}',
			},
			item: {
				activeBackground: '{navigation.item.active.background}',
				activeColor: '{navigation.item.active.color}',
				borderRadius: '{navigation.item.border.radius}',
				color: '{navigation.item.color}',
				focusBackground: '{navigation.item.focus.background}',
				focusColor: '{navigation.item.focus.color}',
				gap: '{navigation.item.gap}',
				icon: {
					activeColor: '{navigation.item.icon.active.color}',
					color: '{navigation.item.icon.color}',
					focusColor: '{navigation.item.icon.focus.color}',
				},
				padding: '{navigation.item.padding}',
				'padding-x': '{navigation.item.padding.x}',
				'padding-y': '{navigation.item.padding.y}',
			},
			list: {
				gap: '{navigation.list.gap}',
				padding: '{navigation.list.padding}',
				'padding-x': '{navigation.list.padding.x}',
				'padding-y': '{navigation.list.padding.y}',
			},
			separator: {
				borderColor: '{content.border.color}',
			},
			submenuIcon: {
				activeColor: '{navigation.submenu.icon.active.color}',
				color: '{navigation.submenu.icon.color}',
				focusColor: '{navigation.submenu.icon.focus.color}',
				size: '{navigation.submenu.icon.size}',
			},
			submenu: {
				mobileIndent: '1rem',
			},
		},
		timeline: {
			eventConnector: {
				color: '{content.border.color}',
				size: '2px',
			},
			eventMarker: {
				background: '{content.background}',
				borderColor: '{content.border.color}',
				borderRadius: '7.875px',
				borderWidth: '2px',
				content: {
					background: '{primary.color}',
					borderRadius: '2.625px',
					insetShadow: '0 1px 1px 0 #0000001f, 0 1px 0 0 #0000000f',
					size: '0.375rem',
				},
				size: '1.125rem',
			},
			event: {
				minHeight: '5rem',
			},
			horizontal: {
				eventContent: {
					padding: '1rem 0',
				},
				event: {
					content: {
						padding: {
							x: '0rem',
							y: '1rem',
						},
					},
				},
			},
			vertical: {
				eventContent: {
					padding: '0 1rem',
				},
				event: {
					content: {
						padding: {
							x: '1rem',
							y: '0rem',
						},
					},
				},
			},
		},
		toast: {
			colorScheme: {
				light: {
					root: {
						blur: '1.5px',
					},
					contrast: {
						background: '{surface.900}',
						borderColor: '{surface.950}',
						closeButton: {
							focusRing: {
								color: '{surface.50}',
							},
							hoverBackground: '{surface.800}',
						},
						color: '{surface.50}',
						detailColor: '{surface.0}',
					},
					error: {
						background: '{red.100}',
						borderColor: '{red.200}',
						closeButton: {
							focusRing: {
								color: '{red.950}',
							},
							hoverBackground: '{toast.error.border.color}',
						},
						color: '{red.950}',
						detailColor: '{zinc.700}',
					},
					info: {
						background: '{cyan.200}',
						borderColor: '{cyan.300}',
						closeButton: {
							focusRing: {
								color: '{blue.950}',
							},
							hoverBackground: '{toast.info.border.color}',
						},
						color: '{blue.950}',
						detailColor: '{zinc.700}',
					},
					secondary: {
						background: '{surface.0}',
						borderColor: '{zinc.300}',
						closeButton: {
							focusRing: {
								color: '{surface.950}',
							},
							hoverBackground: '{zinc.100}',
						},
						color: '{zinc.950}',
						detailColor: '{zinc.700}',
					},
					success: {
						background: '{teal.100}',
						borderColor: '{teal.200}',
						closeButton: {
							focusRing: {
								color: '{teal.950}',
							},
							hoverBackground: '{toast.success.border.color}',
						},
						color: '{teal.950}',
						detailColor: '{zinc.700}',
					},
					warn: {
						background: '{amber.100}',
						borderColor: '{amber.200}',
						closeButton: {
							focusRing: {
								color: '{amber.950}',
							},
							hoverBackground: '{toast.warn.border.color}',
						},
						color: '{amber.950}',
						detailColor: '{zinc.700}',
					},
				},
				dark: {
					root: {
						blur: '10px',
					},
					contrast: {
						background: '{transparent}',
						borderColor: '{surface.100}',
						closeButton: {
							focusRing: {
								color: '{surface.950}',
							},
							hoverBackground: '{surface.100}',
						},
						color: '{zinc.300}',
						detailColor: '{zinc.300}',
					},
					error: {
						background: '{red.300}',
						borderColor: '{red.200}',
						closeButton: {
							focusRing: {
								color: '{red.950}',
							},
							hoverBackground: '{toast.error.border.color}',
						},
						color: '{red.950}',
						detailColor: '{zinc.900}',
					},
					info: {
						background: '{cyan.300}',
						borderColor: '{cyan.200}',
						closeButton: {
							focusRing: {
								color: '{blue.950}',
							},
							hoverBackground: '{toast.info.border.color}',
						},
						color: '{blue.950}',
						detailColor: '{zinc.900}',
					},
					secondary: {
						background: '{surface.0}',
						borderColor: '{zinc.300}',
						closeButton: {
							focusRing: {
								color: '{surface.950}',
							},
							hoverBackground: '{zinc.100}',
						},
						color: '{text.color}',
						detailColor: '{text.muted.color}',
					},
					success: {
						background: '{teal.400}',
						borderColor: '{teal.200}',
						closeButton: {
							focusRing: {
								color: '{teal.950}',
							},
							hoverBackground: '{toast.success.border.color}',
						},
						color: '{teal.950}',
						detailColor: '{zinc.900}',
					},
					warn: {
						background: '{amber.300}',
						borderColor: '{amber.200}',
						closeButton: {
							focusRing: {
								color: '{amber.950}',
							},
							hoverBackground: '{toast.warn.border.color}',
						},
						color: '{amber.950}',
						detailColor: '{zinc.900}',
					},
				},
			},
			root: {
				borderRadius: '{content.border.radius}',
				borderWidth: '1px',
				transitionDuration: '{transition.duration}',
				width: '25rem',
			},
			closeButton: {
				borderRadius: '0.875rem',
				focusRing: {
					offset: '{focus.ring.offset}',
					style: '{focus.ring.style}',
					width: '{focus.ring.width}',
				},
				height: '1.75rem',
				width: '1.75rem',
			},
			closeIcon: {
				size: '1rem',
			},
			content: {
				gap: '0.5rem',
				padding: '{overlay.popover.padding}',
			},
			contrast: {
				closeButton: {
					focusRing: {
						shadow: 'none',
					},
				},
				shadow: '0 8px 16px 0 #45515a1a',
			},
			detail: {
				fontSize: '0.875rem',
				fontWeight: '500',
			},
			error: {
				closeButton: {
					focusRing: {
						shadow: 'none',
					},
				},
				outlined: {
					background: 'light-dark({surface.0}, #e8446b26)',
					border: {
						color: 'light-dark({surface.0}, {red.200})',
					},
					color: 'light-dark({surface.0}, {red.400})',
					detail: {
						color: 'light-dark({surface.0}, {text.color})',
					},
				},
				shadow: '0 8px 16px 0 #45515a1a',
			},
			icon: {
				size: '1.125rem',
			},
			info: {
				closeButton: {
					focusRing: {
						shadow: 'none',
					},
				},
				outlined: {
					background: 'light-dark({surface.0}, #61d1ed26)',
					border: {
						color: 'light-dark({surface.0}, {cyan.400})',
					},
					color: 'light-dark({surface.0}, {cyan.400})',
					detail: {
						color: 'light-dark({surface.0}, {text.color})',
					},
				},
				shadow: '0 8px 16px 0 #45515a1a',
			},
			secondary: {
				closeButton: {
					focusRing: {
						shadow: 'none',
					},
				},
				outlined: {
					background: 'light-dark({surface.0}, #ffffff26)',
					border: {
						color: 'light-dark({surface.0}, {zinc.300})',
					},
					color: 'light-dark({surface.0}, {text.color})',
					detail: {
						color: 'light-dark({surface.0}, {text.color})',
					},
				},
				shadow: '0 8px 16px 0 #45515a1a',
			},
			success: {
				closeButton: {
					focusRing: {
						shadow: 'none',
					},
				},
				outlined: {
					background: 'light-dark({surface.0}, #4fd2b326)',
					border: {
						color: 'light-dark({surface.0}, {teal.600})',
					},
					color: 'light-dark({surface.0}, {teal.500})',
					detail: {
						color: 'light-dark({surface.0}, {text.color})',
					},
				},
				shadow: '0 8px 16px 0 #45515a1a',
			},
			summary: {
				fontSize: '1rem',
				fontWeight: '500',
			},
			text: {
				gap: '0.5rem',
			},
			warn: {
				closeButton: {
					focusRing: {
						shadow: 'none',
					},
				},
				outlined: {
					background: 'light-dark({surface.0}, #ffc87026)',
					border: {
						color: 'light-dark({surface.0}, {amber.600})',
					},
					color: 'light-dark({surface.0}, {amber.400})',
					detail: {
						color: 'light-dark({surface.0}, {text.color})',
					},
				},
				shadow: '0 8px 16px 0 #45515a1a',
			},
		},
		togglebutton: {
			colorScheme: {
				light: {
					root: {
						background: '{surface.0}',
						borderColor: '{form.field.border.color}',
						checkedBackground: '{surface.0}',
						checkedBorderColor: '{form.field.border.color}',
						checkedColor: '{surface.0}',
						color: '{zinc.500}',
						hoverBackground: '{surface.100}',
						hoverColor: '{surface.700}',
					},
					content: {
						checkedBackground: '{primary.color}',
					},
					icon: {
						checkedColor: '{surface.0}',
						color: '{form.field.icon.color}',
						hoverColor: '{surface.700}',
					},
				},
				dark: {
					root: {
						background: '{slate.950}',
						borderColor: '{zinc.600}',
						checkedBackground: '{slate.950}',
						checkedBorderColor: '{zinc.600}',
						checkedColor: '{slate.950}',
						color: '{zinc.300}',
						hoverBackground: '{surface.950}',
						hoverColor: '{surface.300}',
					},
					content: {
						checkedBackground: '{primary.color}',
					},
					icon: {
						checkedColor: '{slate.950}',
						color: '{zinc.300}',
						hoverColor: '{surface.300}',
					},
				},
			},
			root: {
				borderRadius: '{form.field.border.radius}',
				disabledBackground: '{form.field.disabled.background}',
				disabledBorderColor: '{form.field.disabled.background}',
				disabledColor: '{form.field.disabled.color}',
				focusRing: {
					color: '{focus.ring.color}',
					offset: '{focus.ring.offset}',
					shadow: 'none',
					style: '{focus.ring.style}',
					width: '{focus.ring.width}',
				},
				fontWeight: '500',
				gap: '0.5rem',
				invalidBorderColor: '{form.field.invalid.border.color}',
				lg: {
					fontSize: '{form.field.lg.font.size}',
					padding: '0.25rem',
				},
				padding: '0.25rem',
				sm: {
					fontSize: '{form.field.sm.font.size}',
					padding: '0.25rem',
				},
				transitionDuration: '{form.field.transition.duration}',
			},
			content: {
				borderRadius: '{border.radius.sm}',
				checked: {
					border: {
						color: '{primary.color}',
					},
				},
				checkedShadow: '0 1px 2px 0 #0000000a, 0 1px 2px 0 #00000005',
				left: '{scale.0-25}',
				lg: {
					padding: '0.25rem 0.75rem',
					'padding-x': '0.75rem',
					'padding-y': '0.25rem',
				},
				padding: '0.375rem 0.75rem',
				'padding-x': '0.75rem',
				'padding-y': '0.375rem',
				sm: {
					padding: '0.25rem 0.75rem',
					'padding-x': '0.75rem',
					'padding-y': '0.25rem',
				},
				top: '{scale.0-25}',
			},
			icon: {
				disabledColor: '{form.field.disabled.color}',
			},
		},
		toggleswitch: {
			colorScheme: {
				light: {
					root: {
						background: '{surface.0}',
						checkedBackground: '{teal.500}',
						checkedHoverBackground: '{teal.200}',
						disabledBackground: '{form.field.disabled.background}',
						hoverBackground: '{surface.400}',
					},
					handle: {
						background: '{teal.950}',
						checkedBackground: '{teal.950}',
						checkedColor: '{primary.color}',
						checkedHoverBackground: '{surface.0}',
						checkedHoverColor: '{primary.hover.color}',
						color: '{text.muted.color}',
						disabledBackground: '{teal.100}',
						hoverBackground: '{primary.hover.color}',
						hoverColor: '{text.color}',
					},
				},
				dark: {
					root: {
						background: '{slate.900}',
						checkedBackground: '{teal.400}',
						checkedHoverBackground: '{teal.200}',
						disabledBackground: '{slate.700}',
						hoverBackground: '{slate.700}',
					},
					handle: {
						background: '{teal.400}',
						checkedBackground: '{teal.950}',
						checkedColor: '{primary.color}',
						checkedHoverBackground: '{zinc.100}',
						checkedHoverColor: '{primary.hover.color}',
						color: '{surface.900}',
						disabledBackground: '{teal.200}',
						hoverBackground: '{surface.300}',
						hoverColor: '{surface.800}',
					},
				},
			},
			root: {
				borderColor: '{form.field.border.color}',
				borderRadius: '30px',
				borderWidth: '1px',
				checkedBorderColor: '#00000000',
				checkedHoverBorderColor: '#00000000',
				focusRing: {
					color: '{teal.500}',
					offset: '{focus.ring.offset}',
					shadow: 'none',
					style: '{focus.ring.style}',
					width: '{focus.ring.width}',
				},
				gap: '0.25rem',
				height: '1.5rem',
				hoverBorderColor: '{form.field.border.color}',
				invalidBorderColor: '{form.field.invalid.border.color}',
				shadow: '0 1px 2px 0 #1212170d',
				slideDuration: '0.2s',
				transitionDuration: '{transition.duration}',
				width: '2.5rem',
			},
			handle: {
				borderRadius: '0.5rem',
				size: '1rem',
			},
		},
		toolbar: {
			root: {
				background: '{content.background}',
				borderColor: '{content.border.color}',
				borderRadius: '{content.border.radius}',
				color: '{content.color}',
				gap: '0.5rem',
				padding: '0.75rem',
			},
		},
		tooltip: {
			colorScheme: {
				light: {
					root: {
						background: '{zinc.900}',
						color: '{surface.0}',
					},
				},
				dark: {
					root: {
						background: '{surface.700}',
						color: '{surface.50}',
					},
				},
			},
			root: {
				borderRadius: '{overlay.popover.border.radius}',
				gutter: '0.25rem',
				maxWidth: '12.5rem',
				padding: '0.5rem 0.75rem',
				shadow: '0 2px 4px -2px #0000001a, 0 4px 6px -1px #0000001a',
			},
			extend: {
				padding: {
					x: '0.75rem',
					y: '0.5rem',
				},
			},
		},
		tree: {
			root: {
				background: '{content.background}',
				color: '{content.color}',
				gap: '2px',
				indent: '1rem',
				padding: '1rem',
				transitionDuration: '{transition.duration}',
			},
			filter: {
				margin: '0.5rem',
			},
			loadingIcon: {
				size: '2rem',
			},
			node: {
				borderRadius: '{content.border.radius}',
				color: '{text.color}',
				focusRing: {
					color: '{focus.ring.color}',
					offset: '-1px',
					shadow: 'none',
					style: '{focus.ring.style}',
					width: '{focus.ring.width}',
				},
				gap: '0.25rem',
				hoverBackground: '{content.hover.background}',
				hoverColor: '{text.hover.color}',
				padding: '0.25rem 0.5rem',
				'padding-x': '0.5rem',
				'padding-y': '0.25rem',
				selectedBackground: '{highlight.background}',
				selectedColor: '{highlight.color}',
			},
			nodeIcon: {
				color: '{text.muted.color}',
				hoverColor: '{text.hover.muted.color}',
				selectedColor: '{highlight.color}',
			},
			nodeToggleButton: {
				borderRadius: '0.875rem',
				color: '{text.muted.color}',
				focusRing: {
					color: '{focus.ring.color}',
					offset: '{focus.ring.offset}',
					shadow: 'none',
					style: '{focus.ring.style}',
					width: '{focus.ring.width}',
				},
				hoverBackground: '{content.hover.background}',
				hoverColor: '{text.hover.muted.color}',
				selectedHoverBackground: '{content.background}',
				selectedHoverColor: '{primary.color}',
				size: '1.75rem',
			},
		},
		treeselect: {
			root: {
				background: '{form.field.background}',
				borderColor: '{form.field.border.color}',
				borderRadius: '{form.field.border.radius}',
				color: '{form.field.color}',
				disabledBackground: '{form.field.disabled.background}',
				disabledColor: '{form.field.disabled.color}',
				filledBackground: '{form.field.filled.background}',
				filledFocusBackground: '{form.field.filled.focus.background}',
				filledHoverBackground: '{form.field.filled.hover.background}',
				focusBorderColor: '{form.field.focus.border.color}',
				focusRing: {
					color: '{form.field.focus.ring.color}',
					offset: '{form.field.focus.ring.offset}',
					shadow: 'none',
					style: '{form.field.focus.ring.style}',
					width: '{form.field.focus.ring.width}',
				},
				hoverBorderColor: '{form.field.hover.border.color}',
				invalidBorderColor: '{form.field.invalid.border.color}',
				invalidPlaceholderColor: '{form.field.invalid.placeholder.color}',
				lg: {
					fontSize: '{form.field.lg.font.size}',
					paddingX: '{form.field.lg.padding.x}',
					paddingY: '{form.field.lg.padding.y}',
				},
				paddingX: '{form.field.padding.x}',
				paddingY: '{form.field.padding.y}',
				placeholderColor: '{form.field.placeholder.color}',
				shadow: '0 1px 2px 0 #1212170d',
				sm: {
					fontSize: '{form.field.sm.font.size}',
					paddingX: '{form.field.sm.padding.x}',
					paddingY: '{form.field.sm.padding.y}',
				},
				transitionDuration: '{transition.duration}',
			},
			chip: {
				borderRadius: '{border.radius.sm}',
			},
			clearIcon: {
				color: '{form.field.icon.color}',
			},
			dropdown: {
				color: '{form.field.icon.color}',
				width: '2.5rem',
			},
			emptyMessage: {
				padding: '{list.option.padding}',
			},
			overlay: {
				background: '{overlay.select.background}',
				borderColor: '{overlay.select.border.color}',
				borderRadius: '{overlay.select.border.radius}',
				color: '{overlay.select.color}',
				shadow: '0 1px 2px -1px #0000001a, 0 1px 3px 0 #0000001a',
			},
			tree: {
				padding: '0.25rem',
				'padding-x': '{scale.0-25}',
				'padding-y': '{scale.0-25}',
			},
		},
		treetable: {
			bodyCell: {
				borderColor: '{treetable.border.color}',
				gap: '0.5rem',
				padding: '0.75rem 1rem',
			},
			extend: {
				body: {
					cell: {
						padding: {
							lg: '13.125px',
							sm: '5.25px',
							x: '1rem',
							y: '0.75rem',
						},
					},
				},
			},
			colorScheme: {
				light: {
					bodyCell: {
						selectedBorderColor: '{primary.100}',
					},
					root: {
						borderColor: '{content.border.color}',
					},
				},
				dark: {
					bodyCell: {
						selectedBorderColor: '{primary.900}',
					},
					root: {
						borderColor: '{surface.800}',
					},
				},
			},
			columnFooter: {
				fontWeight: '600',
			},
			columnResizer: {
				width: '0.5rem',
			},
			columnTitle: {
				fontWeight: '600',
			},
			footer: {
				background: '{content.background}',
				borderColor: '{treetable.border.color}',
				borderWidth: '1px',
				cell: {
					padding: {
						lg: '13.125px',
						sm: '5.25px',
						x: '1rem',
						y: '0.75rem',
					},
				},
				color: '{content.color}',
				padding: '0.75rem 1rem',
				'padding-lg': '13.125px',
				'padding-sm': '5.25px',
				'padding-x': '1rem',
				'padding-y': '0.75rem',
			},
			footerCell: {
				background: '{content.background}',
				borderColor: '{treetable.border.color}',
				color: '{content.color}',
				padding: '0.75rem 1rem',
			},
			header: {
				background: '{content.background}',
				borderColor: '{treetable.border.color}',
				borderWidth: '1px',
				cell: {
					padding: {
						lg: '13.125px',
						sm: '5.25px',
						x: '1rem',
						y: '0.75rem',
					},
				},
				color: '{content.color}',
				padding: '0.75rem 1rem',
				'padding-lg': '13.125px',
				'padding-sm': '5.25px',
				'padding-x': '1rem',
				'padding-y': '0.75rem',
			},
			headerCell: {
				background: '{content.background}',
				borderColor: '{treetable.border.color}',
				color: '{content.color}',
				focusRing: {
					color: '{focus.ring.color}',
					offset: '-1px',
					shadow: 'none',
					style: '{focus.ring.style}',
					width: '{focus.ring.width}',
				},
				gap: '0.5rem',
				hoverBackground: '{content.hover.background}',
				hoverColor: '{content.hover.color}',
				padding: '0.75rem 1rem',
				selectedBackground: '{highlight.background}',
				selectedColor: '{highlight.color}',
			},
			loadingIcon: {
				size: '2rem',
			},
			nodeToggleButton: {
				borderRadius: '0.875rem',
				color: '{text.muted.color}',
				focusRing: {
					color: '{focus.ring.color}',
					offset: '{focus.ring.offset}',
					shadow: 'none',
					style: '{focus.ring.style}',
					width: '{focus.ring.width}',
				},
				hoverBackground: '{content.hover.background}',
				hoverColor: '{text.color}',
				selectedHoverBackground: '{content.background}',
				selectedHoverColor: '{primary.color}',
				size: '1.75rem',
			},
			paginatorBottom: {
				borderColor: '{content.border.color}',
				borderWidth: '1px',
			},
			paginatorTop: {
				borderColor: '{content.border.color}',
				borderWidth: '1px',
			},
			resizeIndicator: {
				color: '{primary.color}',
				width: '1px',
			},
			row: {
				background: '{content.background}',
				color: '{content.color}',
				focusRing: {
					color: '{focus.ring.color}',
					offset: '-1px',
					shadow: 'none',
					style: '{focus.ring.style}',
					width: '{focus.ring.width}',
				},
				hoverBackground: '{content.hover.background}',
				hoverColor: '{content.hover.color}',
				selectedBackground: '{highlight.background}',
				selectedColor: '{highlight.color}',
			},
			sortIcon: {
				color: '{text.muted.color}',
				hoverColor: '{text.hover.muted.color}',
				size: '0.875rem',
			},
			root: {
				transitionDuration: '{transition.duration}',
			},
		},
		virtualscroller: {
			loader: {
				icon: {
					size: '2rem',
				},
				mask: {
					background: '{content.background}',
					color: '{text.muted.color}',
				},
			},
		},
	},
	primitive: {
		amber: {
			'50': '#fffbf4ff',
			'100': '#ffeac8ff',
			'200': '#ffd99cff',
			'300': '#ffc870ff',
			'400': '#ffb845ff',
			'500': '#ffa719ff',
			'600': '#d98e15ff',
			'700': '#b37512ff',
			'800': '#8c5c0eff',
			'900': '#66430aff',
			'950': '#402a06ff',
		},
		blue: {
			'50': '#f4f7fdff',
			'100': '#c9d7f7ff',
			'200': '#9eb8f1ff',
			'300': '#7399ebff',
			'400': '#4879e4ff',
			'500': '#1d5adeff',
			'600': '#194dbdff',
			'700': '#143f9bff',
			'800': '#10327aff',
			'900': '#0c2459ff',
			'950': '#071738ff',
		},
		borderRadius: {
			lg: '12px',
			md: '8px',
			none: '0',
			sm: '6px',
			xl: '16px',
			xs: '4px',
		},
		cyan: {
			'50': '#f2fbfeff',
			'100': '#c2edf8ff',
			'200': '#91dff3ff',
			'300': '#61d1edff',
			'400': '#30c3e8ff',
			'500': '#00b5e2ff',
			'600': '#009ac0ff',
			'700': '#007f9eff',
			'800': '#00647cff',
			'900': '#00485aff',
			'950': '#083344ff',
		},
		gray: {
			'50': '#fdfefeff',
			'100': '#f7f8f9ff',
			'200': '#f1f3f5ff',
			'300': '#ebeef0ff',
			'400': '#e5e8ecff',
			'500': '#dfe3e7ff',
			'600': '#bec1c4ff',
			'700': '#9c9fa2ff',
			'800': '#7b7d7fff',
			'900': '#595b5cff',
			'950': '#030712ff',
		},
		green: {
			'50': '#f2f9f5ff',
			'100': '#c2e2d1ff',
			'200': '#92ccacff',
			'300': '#62b588ff',
			'400': '#329f63ff',
			'500': '#00883fff',
			'600': '#027436ff',
			'700': '#015f2cff',
			'800': '#014b23ff',
			'900': '#013619ff',
			'950': '#052e16ff',
		},
		lime: {
			'50': '#fafdf2ff',
			'100': '#e5f5c2ff',
			'200': '#d1ed91ff',
			'300': '#bce561ff',
			'400': '#a8dd30ff',
			'500': '#93d500ff',
			'600': '#7db500ff',
			'700': '#679500ff',
			'800': '#517500ff',
			'900': '#3b5500ff',
			'950': '#1a2e05ff',
		},
		neutral: {
			'50': '#feffffff',
			'100': '#fcfdfdff',
			'200': '#fafbfcff',
			'300': '#f8f9fbff',
			'400': '#f5f8f9ff',
			'500': '#f3f6f8ff',
			'600': '#cfd1d3ff',
			'700': '#aaacaeff',
			'800': '#868788ff',
			'900': '#616263ff',
			'950': '#0a0a0aff',
		},
		pink: {
			'50': '#fcf4fbff',
			'100': '#f3cbecff',
			'200': '#e9a2ddff',
			'300': '#df79ceff',
			'400': '#d650bfff',
			'500': '#cc27b0ff',
			'600': '#ad2196ff',
			'700': '#8f1b7bff',
			'800': '#701561ff',
			'900': '#521046ff',
			'950': '#330a2cff',
		},
		purple: {
			'50': '#f8f5fcff',
			'100': '#ded0efff',
			'200': '#c4abe3ff',
			'300': '#a985d6ff',
			'400': '#8f60caff',
			'500': '#753bbdff',
			'600': '#6332a1ff',
			'700': '#522984ff',
			'800': '#402068ff',
			'900': '#2f184cff',
			'950': '#3b0764ff',
		},
		red: {
			'50': '#fef3f6ff',
			'100': '#f8c8d3ff',
			'200': '#f39cb0ff',
			'300': '#ed708eff',
			'400': '#e8446bff',
			'500': '#e21848ff',
			'600': '#c0143dff',
			'700': '#9e1132ff',
			'800': '#7c0d28ff',
			'900': '#5a0a1dff',
			'950': '#450a0aff',
		},
		sky: {
			'50': '#f2f8fdff',
			'100': '#c2def6ff',
			'200': '#91c3efff',
			'300': '#61a9e7ff',
			'400': '#308ee0ff',
			'500': '#0074d9ff',
			'600': '#0063b8ff',
			'700': '#005198ff',
			'800': '#004077ff',
			'900': '#002e57ff',
			'950': '#082f49ff',
		},
		slate: {
			'50': '#f8fafcff',
			'100': '#f1f5f9ff',
			'200': '#e2e8f0ff',
			'300': '#cbd5e1ff',
			'400': '#94a3b8ff',
			'500': '#64748bff',
			'600': '#475569ff',
			'700': '#334155ff',
			'800': '#1e293bff',
			'900': '#0f172aff',
			'950': '#020617ff',
		},
		stone: {
			'50': '#f4f4f5ff',
			'100': '#cacccfff',
			'200': '#a0a4a9ff',
			'300': '#757c82ff',
			'400': '#4b535cff',
			'500': '#212b36ff',
			'600': '#1c252eff',
			'700': '#171e26ff',
			'800': '#12181eff',
			'900': '#0d1116ff',
			'950': '#080b0eff',
		},
		teal: {
			'50': '#f4fcfaff',
			'100': '#cbf2e8ff',
			'200': '#a2e7d7ff',
			'300': '#78ddc5ff',
			'400': '#4fd2b3ff',
			'500': '#26c8a1ff',
			'600': '#20aa89ff',
			'700': '#1b8c71ff',
			'800': '#156e59ff',
			'900': '#0f5040ff',
			'950': '#0a3228ff',
		},
		yellow: {
			'50': '#fffdf2ff',
			'100': '#fff5c2ff',
			'200': '#ffed91ff',
			'300': '#fee561ff',
			'400': '#fedd30ff',
			'500': '#fed500ff',
			'600': '#d8b500ff',
			'700': '#b29500ff',
			'800': '#8c7500ff',
			'900': '#665500ff',
			'950': '#422006ff',
		},
		zinc: {
			'50': '#f7f8f9ff',
			'100': '#dadde1ff',
			'200': '#bcc3c9ff',
			'300': '#9ea8b1ff',
			'400': '#818e99ff',
			'500': '#637381ff',
			'600': '#54626eff',
			'700': '#45515aff',
			'800': '#363f47ff',
			'900': '#282e34ff',
			'950': '#191d20ff',
		},
	},
	semantic: {
		anchorGutter: '2px',
		colorScheme: {
			light: {
				content: {
					background: '{surface.0}',
					borderColor: '{slate.200}',
					color: '{text.color}',
					hoverBackground: '{surface.100}',
					hoverColor: '{text.hover.color}',
				},
				formField: {
					background: '{neutral.100}',
					borderColor: '{slate.300}',
					color: '{text.color}',
					disabledBackground: '{zinc.50}',
					disabledColor: '{zinc.300}',
					filledBackground: '{surface.50}',
					filledFocusBackground: '{surface.50}',
					filledHoverBackground: '{surface.50}',
					floatLabelActiveColor: '{zinc.700}',
					floatLabelColor: '{zinc.700}',
					floatLabelFocusColor: '{zinc.700}',
					floatLabelInvalidColor: '{form.field.invalid.placeholder.color}',
					focusBorderColor: '{primary.color}',
					hoverBorderColor: '{neutral.800}',
					iconColor: '{stone.500}',
					invalidBorderColor: '{red.500}',
					invalidPlaceholderColor: '{red.500}',
					placeholderColor: '{zinc.500}',
				},
				highlight: {
					background: '{primary.50}',
					color: '{primary.700}',
					focusBackground: '{primary.100}',
					focusColor: '{primary.800}',
				},
				list: {
					option: {
						color: '{text.color}',
						focusBackground: '{surface.100}',
						focusColor: '{text.hover.color}',
						icon: {
							color: '{form.field.icon.color}',
							focusColor: '{form.field.icon.color}',
						},
						selectedBackground: '{highlight.background}',
						selectedColor: '{highlight.color}',
						selectedFocusBackground: '{highlight.focus.background}',
						selectedFocusColor: '{highlight.focus.color}',
					},
					optionGroup: {
						background: '#00000000',
						color: '{text.muted.color}',
					},
				},
				mask: {
					background: '#45515acc',
					color: '{surface.200}',
				},
				navigation: {
					item: {
						activeBackground: '{surface.500}',
						activeColor: '{primary.active.color}',
						color: '{text.color}',
						focusBackground: '{surface.500}',
						focusColor: '{primary.hover.color}',
						icon: {
							activeColor: '{primary.550}',
							color: '{zinc.900}',
							focusColor: '{primary.550}',
						},
					},
					submenuIcon: {
						activeColor: '{surface.500}',
						color: '{stone.500}',
						focusColor: '{stone.500}',
					},
					submenuLabel: {
						background: '#00000000',
						color: '{text.color}',
					},
				},
				overlay: {
					modal: {
						background: '{surface.0}',
						borderColor: '{zinc.100}',
						color: '{text.color}',
					},
					popover: {
						background: '{surface.0}',
						borderColor: '{zinc.100}',
						color: '{text.color}',
					},
					select: {
						background: '{surface.0}',
						borderColor: '{surface.200}',
						color: '{text.color}',
					},
				},
				primary: {
					activeColor: '{primary.700}',
					color: '{primary.500}',
					contrastColor: '{surface.0}',
					hoverColor: '{primary.600}',
				},
				surface: {
					'0': '#ffffffff',
					'50': '{gray.50}',
					'100': '{gray.100}',
					'200': '{carbon.200}',
					'300': '{gray.300}',
					'400': '{gray.400}',
					'500': '#f4f6faff',
					'600': '{gray.600}',
					'700': '{gray.700}',
					'800': '{gray.800}',
					'900': '{gray.900}',
					'950': '{gray.950}',
				},
				text: {
					color: '{zinc.900}',
					hoverColor: '{text.color}',
					hoverMutedColor: '{zinc.400}',
					mutedColor: '{zinc.500}',
				},
			},
			dark: {
				content: {
					background: '{slate.800}',
					borderColor: '{zinc.600}',
					color: '{text.color}',
					hoverBackground: '{slate.900}',
					hoverColor: '{text.hover.color}',
				},
				formField: {
					background: '{surface.950}',
					borderColor: '{zinc.600}',
					color: '{text.color}',
					disabledBackground: '{surface.700}',
					disabledColor: '{surface.400}',
					filledBackground: '{surface.800}',
					filledFocusBackground: '{surface.800}',
					filledHoverBackground: '{surface.800}',
					floatLabelActiveColor: '{zinc.400}',
					floatLabelColor: '{surface.400}',
					floatLabelFocusColor: '{surface.400}',
					floatLabelInvalidColor: '{form.field.invalid.placeholder.color}',
					focusBorderColor: '{primary.color}',
					hoverBorderColor: '{surface.500}',
					iconColor: '{surface.50}',
					invalidBorderColor: '{red.300}',
					invalidPlaceholderColor: '{red.400}',
					placeholderColor: '{surface.400}',
				},
				highlight: {
					background: '{slate.700}',
					color: '#ffffffde',
					focusBackground: '#34d3993d',
					focusColor: '#ffffffde',
				},
				list: {
					option: {
						color: '{text.color}',
						focusBackground: '{list.option.selected.focus.background}',
						focusColor: '{text.hover.color}',
						icon: {
							color: '{form.field.icon.color}',
							focusColor: '{form.field.icon.color}',
						},
						selectedBackground: '{highlight.background}',
						selectedColor: '{highlight.color}',
						selectedFocusBackground: '{list.option.selected.background}',
						selectedFocusColor: '{highlight.focus.color}',
					},
					optionGroup: {
						background: '#00000000',
						color: '{text.muted.color}',
					},
				},
				mask: {
					background: '#020617e5',
					color: '{surface.200}',
				},
				navigation: {
					item: {
						activeBackground: '{slate.950}',
						activeColor: '{primary.active.color}',
						color: '{text.color}',
						focusBackground: '{slate.900}',
						focusColor: '{primary.hover.color}',
						icon: {
							activeColor: '{primary.active.color}',
							color: '{zinc.100}',
							focusColor: '{primary.hover.color}',
						},
					},
					submenuIcon: {
						activeColor: '{primary.active.color}',
						color: '{zinc.100}',
						focusColor: '{primary.hover.color}',
					},
					submenuLabel: {
						background: '#00000000',
						color: '{text.muted.color}',
					},
				},
				overlay: {
					modal: {
						background: '{content.background}',
						borderColor: '{surface.700}',
						color: '{text.color}',
					},
					popover: {
						background: '{content.background}',
						borderColor: '{slate.500}',
						color: '{text.color}',
					},
					select: {
						background: '{slate.950}',
						borderColor: '{zinc.600}',
						color: '{text.color}',
					},
				},
				primary: {
					activeColor: '{lightblue.300}',
					color: '{lightblue.500}',
					contrastColor: '{slate.950}',
					hoverColor: '{lightblue.400}',
				},
				surface: {
					'0': '{slate.800}',
					'50': '{zinc.50}',
					'100': '{zinc.100}',
					'200': '{slate.950}',
					'300': '{zinc.300}',
					'400': '{zinc.400}',
					'500': '{zinc.500}',
					'600': '{zinc.600}',
					'700': '{zinc.700}',
					'800': '{zinc.800}',
					'900': '{slate.900}',
					'950': '{slate.950}',
				},
				text: {
					color: '{zinc.100}',
					hoverColor: '{zinc.100}',
					hoverMutedColor: '{zinc.400}',
					mutedColor: '{zinc.300}',
				},
			},
		},
		content: {
			borderRadius: '{border.radius.md}',
		},
		disabledOpacity: '0.6',
		focusRing: {
			color: '{primary.color}',
			offset: '2px',
			shadow: 'none',
			style: 'solid',
			width: '1px',
		},
		formField: {
			borderRadius: '{border.radius.md}',
			focusRing: {
				color: '#00000000',
				offset: '0',
				shadow: 'none',
				style: 'solid',
				width: '0',
			},
			lg: {
				fontSize: '1.125rem',
				paddingX: '0.875rem',
				paddingY: '8.25px',
			},
			paddingX: '0.75rem',
			paddingY: '0.5rem',
			shadow: '0 1px 2px 0 #1212170d',
			sm: {
				fontSize: '0.875rem',
				paddingX: '0.625rem',
				paddingY: '6.75px',
			},
			transitionDuration: '{transition.duration}',
		},
		iconSize: '1rem',
		list: {
			gap: '2px',
			header: {
				padding: '0.5rem 1rem 0.25rem',
			},
			option: {
				borderRadius: '{border.radius.md}',
				padding: '0.5rem 0.75rem',
			},
			optionGroup: {
				fontWeight: '600',
				padding: '0.5rem 0.75rem',
			},
			padding: '0.25rem',
		},
		mask: {
			transitionDuration: '0.2s',
		},
		navigation: {
			item: {
				borderRadius: '{border.radius.sm}',
				gap: '0.5rem',
				padding: '0.875rem 0.75rem',
			},
			list: {
				gap: '2px',
				padding: '0.25rem',
			},
			submenuIcon: {
				size: '0.875rem',
			},
			submenuLabel: {
				fontWeight: '600',
				padding: '0.875rem',
			},
		},
		overlay: {
			modal: {
				borderRadius: '{border.radius.xl}',
				padding: '1.25rem',
				shadow: '0 8px 10px -6px #0000001a, 0 20px 25px -5px #0000001a',
			},
			navigation: {
				shadow: '0 2px 4px -2px #0000001a, 0 4px 6px -1px #0000001a',
			},
			popover: {
				borderRadius: '{border.radius.md}',
				padding: '0.75rem',
				shadow: '0 2px 4px -2px #0000001a, 0 4px 6px -1px #0000001a',
			},
			select: {
				borderRadius: '{border.radius.xl}',
				shadow: '0 2px 4px -2px #0000001a, 0 4px 6px -1px #0000001a',
			},
		},
		primary: {
			'50': '{blue.50}',
			'100': '{blue.100}',
			'200': '{blue.200}',
			'300': '{blue.300}',
			'400': '{blue.400}',
			'500': '{blue.500}',
			'600': '{blue.600}',
			'700': '{blue.700}',
			'800': '{blue.800}',
			'900': '{blue.900}',
			'950': '{blue.950}',
		},
		transitionDuration: '0.2s',
	},
	extend: {
		blue: {
			'450': '#155fffff',
			'550': '#2065ffff',
			'650': '#004bc5ff',
		},
		carbon: {
			'100': '#f9fafbff',
			'200': '#f4f6f8ff',
			'300': '#dfe3e8ff',
			'400': '#c4cdd5ff',
			'500': '#95a0abff',
			'600': '#6a7681ff',
			'700': '#454f5bff',
			'800': '#212b36ff',
			'900': '#161c24ff',
		},
		'dark-blue': {
			'50': '#f2f5faff',
			'100': '#c2cee8ff',
			'200': '#91a7d7ff',
			'300': '#6181c5ff',
			'400': '#305ab3ff',
			'500': '#0033a1ff',
			'600': '#002b89ff',
			'700': '#002471ff',
			'800': '#001c59ff',
			'900': '#001440ff',
			'950': '#000d28ff',
		},
		font: {
			heading: {
				large: {
					bold: '700 1.5rem / 2rem Inter, sans-serif',
					semibold: '600 1.5rem / 2rem Inter, sans-serif',
				},
				medium: {
					bold: '700 1.25rem / 2rem Inter, sans-serif',
					semibold: '600 1.25rem / 2rem Inter, sans-serif',
				},
				small: {
					bold: '700 1.125rem / 1.75rem Inter, sans-serif',
					semibold: '600 1.125rem / 1.75rem Inter, sans-serif',
				},
				xlarge: {
					bold: '700 1.75rem / 2.5rem Inter, sans-serif',
					semibold: '600 1.75rem / 2.5rem Inter, sans-serif',
				},
				xsmall: {
					bold: '700 1rem / 1.5rem Inter, sans-serif',
					semibold: '600 1rem / 1.5rem Inter, sans-serif',
				},
				xxsmall: {
					bold: '700 0.875rem / 1.25rem Inter, sans-serif',
					semibold: '600 0.875rem / 1.25rem Inter, sans-serif',
				},
			},
		},
		lightblue: {
			'50': '#e6f7ffff',
			'100': '#ccefffff',
			'200': '#99dfffff',
			'300': '#66cfffff',
			'400': '#33bfffff',
			'500': '#00aaffff',
			'600': '#0088ccff',
			'700': '#006699ff',
			'800': '#004466ff',
			'900': '#002233ff',
			'950': '#00111aff',
		},
		list: {
			header: {
				padding: {
					bottom: '0.25rem',
					left: '1rem',
					right: '1rem',
					top: '0.5rem',
				},
			},
			option: {
				group: {
					padding: {
						x: '0.75rem',
						y: '0.5rem',
					},
				},
				padding: {
					x: '0.75rem',
					y: '0.5rem',
				},
			},
			padding: {
				x: '{scale.0-25}',
				y: '{scale.0-25}',
			},
		},
		navigation: {
			item: {
				padding: {
					x: '0.75rem',
					y: '0.875rem',
				},
			},
			list: {
				padding: {
					x: '{scale.0-25}',
					y: '{scale.0-25}',
				},
			},
			submenu: {
				label: {
					padding: {
						x: '{scale.0-875}',
						y: '{scale.0-875}',
					},
				},
			},
		},
		opacity: {
			'0': '0',
			'10': '0.1',
			'20': '0.2',
			'30': '0.3',
			'40': '0.4',
			'50': '0.5',
			'60': '0.6',
			'70': '0.7',
			'80': '0.8',
			'90': '0.9',
			'100': '1',
		},
		primary: {
			'550': '{blue.550}',
		},
		scale: {
			'1': '1rem',
			'2': '2rem',
			'3': '3rem',
			'4': '4rem',
			'5': '5rem',
			'18': '18rem',
			'25': '25rem',
			'0-125': '0.125rem',
			'0-25': '0.25rem',
			'0-375': '0.375rem',
			'0-5': '0.5rem',
			'0-625': '0.625rem',
			'0-75': '0.75rem',
			'0-875': '0.875rem',
			'1-125': '1.125rem',
			'1-143': '1.143rem',
			'1-25': '1.25rem',
			'1-5': '1.5rem',
			'1-625': '1.625rem',
			'1-75': '1.75rem',
			'12-5': '12.5rem',
			'2-25': '2.25rem',
			'2-5': '2.5rem',
			'2-75': '2.75rem',
			'neg-0-125': '-0.125rem',
			'neg-0-25': '-0.25rem',
			'neg-0-375': '-0.375rem',
			'neg-0-5': '-0.5rem',
			'neg-0-625': '-0.625rem',
			'neg-0-75': '-0.75rem',
			'neg-0-875': '-0.875rem',
			'neg-1': '-1rem',
			'neg-1-125': '-1.125rem',
			'neg-1-25': '-1.25rem',
			'neg-1-5': '-1.5rem',
		},
		transparent: '#ffffff00',
	},
};

/**
 * The option bag PrimeNG hands a preset `css` callback.
 *
 * `dt(tokenPath)` returns the `var(--<prefix>-…)` reference for a preset token under the theme’s
 * active options, which is why the stylesheets below go through it rather than carrying a literal
 * `var(--spds-…)`: mount this preset under another prefix and the CSS follows it.
 */
interface SailPointDesignSystemPresetCssOptions {
	readonly dt: (tokenPath: string, fallback?: string) => string;
}

// SailPointDesignSystem global stylesheets. PrimeNG emits the preset’s root `css` once, up front.
const spdsTypographyGlobalCss = ({ dt }: SailPointDesignSystemPresetCssOptions) =>
	`:root {
	font-family: Inter, sans-serif;
	line-height: normal;
}

h1 {
	font: ${dt('font.heading.xlarge.bold')};
}

h2 {
	font: ${dt('font.heading.large.bold')};
}

h3 {
	font: ${dt('font.heading.medium.bold')};
}

h4 {
	font: ${dt('font.heading.small.bold')};
}

h5 {
	font: ${dt('font.heading.xsmall.bold')};
}

h6 {
	font: ${dt('font.heading.xxsmall.bold')};
}

.spds-h1 {
	font: ${dt('font.heading.xlarge.bold')};
}

.spds-h1--semibold {
	font: ${dt('font.heading.xlarge.semibold')};
}

.spds-h2 {
	font: ${dt('font.heading.large.bold')};
}

.spds-h2--semibold {
	font: ${dt('font.heading.large.semibold')};
}

.spds-h3 {
	font: ${dt('font.heading.medium.bold')};
}

.spds-h3--semibold {
	font: ${dt('font.heading.medium.semibold')};
}

.spds-h4 {
	font: ${dt('font.heading.small.bold')};
}

.spds-h4--semibold {
	font: ${dt('font.heading.small.semibold')};
}

.spds-h5 {
	font: ${dt('font.heading.xsmall.bold')};
}

.spds-h5--semibold {
	font: ${dt('font.heading.xsmall.semibold')};
}

.spds-h6 {
	font: ${dt('font.heading.xxsmall.bold')};
}

.spds-h6--semibold {
	font: ${dt('font.heading.xxsmall.semibold')};
}
`;

// SailPointDesignSystem component stylesheets, each emitted when PrimeNG first loads that component.
const spdsCheckboxComponentCss = () =>
	`p-checkbox {
	display: inline-flex;
}
`;

const spdsDialogComponentCss = () =>
	`.p-dialog-header-actions {
	align-self: flex-start;
}
`;

const spdsTagComponentCss = ({ dt }: SailPointDesignSystemPresetCssOptions) =>
	`.p-tag {
	border: 1px solid ${dt('tag.primary.border.color')};
	line-height: 1;
}
.p-tag-label:empty {
	display: none;
}

.p-tag-secondary {
	border-color: ${dt('tag.secondary.border.color')};
}

.p-tag-info {
	border-color: ${dt('tag.info.border.color')};
}

.p-tag-success {
	border-color: ${dt('tag.success.border.color')};
}

.p-tag-warn {
	border-color: ${dt('tag.warn.border.color')};
}

.p-tag-danger {
	border-color: ${dt('tag.danger.border.color')};
}

.p-tag-contrast {
	border-color: transparent;
}
`;

const spdsPrimePreset = {
	...data,
	css: (options: SailPointDesignSystemPresetCssOptions) => [spdsTypographyGlobalCss(options)].join('\n'),
	components: {
		...data.components,
		checkbox: { ...data.components.checkbox, css: spdsCheckboxComponentCss },
		dialog: { ...data.components.dialog, css: spdsDialogComponentCss },
		tag: { ...data.components.tag, css: spdsTagComponentCss },
	},
};

export const SPDS_DARK_MODE_SELECTOR = '.spds-dark';
export const SPDS_THEME_PREFIX = 'spds';

export default spdsPrimePreset as Preset;
