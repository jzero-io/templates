package cmd

import (
	"github.com/jzero-io/jzero-contrib/filex"
	"github.com/spf13/cobra"
	"github.com/spf13/cobra/doc"
	"path/filepath"
)

var gendocsCmd = &cobra.Command{
	Use:   "gendocs",
	Short: "Generate documentation for {{ .APP }}",
	Run: func(cmd *cobra.Command, args []string) {
		docsType := cmd.Flags().Lookup("type").Value.String()
		docsPath := filepath.Join("docs", docsType)
		err := filex.EnsureDirExists(docsPath)
		cobra.CheckErr(err)
		if docsType == "man" {
			err = doc.GenManTree(rootCmd, &doc.GenManHeader{}, docsPath)
		} else if docsType == "yaml" {
			err = doc.GenYamlTree(rootCmd, docsPath)
		} else if docsType == "rest" {
			err = doc.GenReSTTree(rootCmd, docsPath)
		} else {
			err = doc.GenMarkdownTree(rootCmd, docsPath)
		}
		cobra.CheckErr(err)
	},
}

func init() {

	gendocsCmd.PersistentFlags().StringP("type", "t", "md", "docs type, support [md|man|yaml|rest]")

	rootCmd.AddCommand(gendocsCmd)
}
