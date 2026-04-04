{{ if ne .Style "gozero" }}style: {{.Style}}

{{ end }}gen:
    hooks:
        before:
            - gorename {{.Module}}/server {{.Module}}/internal
        after:
            - gorename {{.Module}}/internal {{.Module}}/server
            - jzero format