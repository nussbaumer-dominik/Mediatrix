set -v
set -x
set -e

LATEX=pdflatex

PANDOCMODULES=markdown+auto_identifiers
PANDOCMODULES=${PANDOCMODULES}+definition_lists
#PANDOCMODULES=${PANDOCMODULES}+compact_definition_lists
PANDOCMODULES=${PANDOCMODULES}+fenced_code_attributes
PANDOCMODULES=${PANDOCMODULES}+autolink_bare_uris
PANDOCMODULES=${PANDOCMODULES}+simple_tables+table_captions
PANDOCMODULES=${PANDOCMODULES}+inline_notes+footnotes+smart


# mit listings
#PANDOCOPT="--listings -S -N -f ${PANDOCMODULES}"
PANDOCOPT="-N -f ${PANDOCMODULES}"

cd markdown
for f in *.md
do
 if [ -d "$f" ]
    then
        for ff in $f/*.md
        do      
           pandoc ${PANDOCOPT} $ff -o $ff.tex 
        done
    else
        pandoc ${PANDOCOPT} $f -o $f.tex
    fi
done
cd ..

LATEXOPT="--shell-escape"

$LATEX ${LATEXOPT} diplomarbeit.tex &&
makeindex -c -q diplomarbeit.idx &&
bibtex diplomarbeit
$LATEX ${LATEXOPT} diplomarbeit.tex &&
$LATEX ${LATEXOPT} diplomarbeit.tex
