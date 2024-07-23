#!/usr/bin/env bash

##
# Dependencies
#
# ## Arch (BTW™)
#
# - go-yq
# - jq
# - okular
#
# Yay
# - pup
##

## Find true directory this script resides in
__SOURCE__="${BASH_SOURCE[0]}"
while [[ -h "${__SOURCE__}" ]]; do
    __SOURCE__="$(find "${__SOURCE__}" -type l -ls | sed -n 's@^.* -> \(.*\)@\1@p')"
done
__NAME__="${__SOURCE__##*/}"
__DIR__="$(cd -P "$(dirname "${__SOURCE__}")" && pwd)"
__G_DIR__="$(dirname "${__DIR__}")"
__AUTHOR__='S0AndS0'
__DESCRIPTION__='Convert URL to PDF via headless Chromium commands'

usage(){
	local _message=( "${@}" )
	cat <<EOF
--company <COMPANY>
	Required: name of company that is being applied to

--job <JOB>
	Required: title of job being applied for

--applicant <NAME>
	Defaults: to first word of 'title' from '../assets/json/page-header.json'

--url <URL>
	Defaults to: http://127.0.0.1:8080/
	Note: for _reasions_ Chromium based browsers do not like localhost redirects

--alias <STRING>
	Pass as query/search string to 'url' to modify contact methods with a
	'mailto:' protocol via client-side JavaScript

--tags <STRING>
	Pass comma seperated list of tags as query/search string to 'url' for hinting
	to client-side JavaScript which skills/projects to highlght

--pdf-path <PATH>
	Defaults to: ~/Downloads/resumes/$(date +%F)/<NAME>_Resume_to_<COMPANY>_for_<JOB>.pdf

--copy-to-tor
	Attempt to copy to;
	~/.local/share/torbrowser/tbb/x86_64/tor-browser/Browser/Downloads/resumes

--dry-run
	Print actions without executing commands

--help
	Print this message and exit

--preview
	Open resulting PDF with okular

--verbose
	Print actions that will be taken

## Example

${__NAME__} --preview \\
  --alias 'example.com' \\
  --company 'Company Name' \\
  --job 'Job Title' \\
  --dry-run

okular ~/Downloads/resumes/$(date +%F)/S0AndS0_Resume_to_Company-Name_for_Job-Title.pdf
EOF
	if (( ${#_message[@]} )); then
		printf >&2 '\n%s\n' "${_message[@]}"
		exit 1
	fi
	exit 0
}

while ((${#@})); do
	case "${1}" in
		--company|--company-name)
			_company_name="${2:?No company name value provided}"
			shift 2;
		;;
		--job|--job-title)
			_job_title="${2:?No job title value provided}"
			shift 2;
		;;
		--applicant|--applicant-name)
			_applicant_name="${2:?No applicant name value provided}"
			shift 2;
		;;
		--url)
			_url="${2:?No URL value provided}"
			shift 2;
		;;
		--pdf-path)
			_pdf_path="${2:?No --pdf-path value provided}"
			shift 2;
		;;
		--alias|--email-alias)
			_email_alias="${2:?No email alias value provided}"
			shift 2;
		;;
		--tags)
			_tags="${2:?No tags value provided}"
			shift 2;
		;;
		--copy-to-tor)
			_copy_to_tor=1
			shift 1;
		;;
		--dry-run)
			_dry_run=1
			shift 1;
		;;
		--help|-h)
			_help=1
			shift 1;
		;;
		--preview)
			_preview=1
			shift 1;
		;;
		--verbose)
			_verbose=1
			shift 1;
		;;
		*)
			usage 'Unrecognized parameter:' "  ${1}"
		;;
	esac
done


if (( _help )); then
	usage ''
fi

## Errors for required parameters

if ! (( ${#_company_name} )); then
	printf >&2 'No value provided for --company-name\n'
	exit 1
fi

if ! (( ${#_job_title} )); then
	printf >&2 'No value provided for --job-title\n'
	exit 1
fi

## Helper functions

get__applicant_name() {
	local _url="${1:?Undefined URL}"
	local _json_dir
	local _json_path
	local _index_dir
	local _applicant_name

	local _index_path="${_url#*//*/}"
	_index_dir="${_index_path%/*}"
	_index_path="${_index_path:-index.html}"

	_json_dir="${__G_DIR__}/${_index_dir}"
	_json_path="$(pup '#page__header json{}' --file "${_index_path}" | jq --raw-output '.[0]."data-json-path"')"

	_applicant_name="$( jq --raw-output '.title | split("[^\\w]+";"g")[0]' "${_json_dir}/${_json_path}" )"

	if (( _verbose )) || (( _dry_run )); then
		cat >&2 <<EOF
## get__applicant_name parsed variables
_url -> ${_url}
_index_path -> ${_index_path}
_index_dir -> ${_index_dir}
_json_dir -> ${_json_dir}
_json_path -> ${_json_path}
_applicant_name -> ${_applicant_name}
EOF
	fi

	if (( ${#_applicant_name} )); then
		printf '%s' "${_applicant_name}"
	else
		printf >&2 'Undefined --applicant-name <VALUE> and failed to parse from URL -> %s\n' "${_url}"
		return 1
	fi
}

get__applicant_email() {
	local _url="${1:?Undefined URL}"
	local _json_dir
	local _json_path
	local _index_dir
	local _applicant_email

	local _index_path="${_url#*//*/}"
	_index_dir="${_index_path%/*}"
	_index_path="${_index_path:-index.html}"

	_json_dir="${__G_DIR__}/${_index_dir}"
	_json_path="$(pup '#container__contact_methods json{}' --file "${_index_path}" | jq --raw-output '.[0]."data-json-path"')"

	_applicant_email="$( jq --raw-output '.links[] | select(.name == "E-Mail") | .url.link' "${_json_dir}/${_json_path}" )"

	if (( _verbose )) || (( _dry_run )); then
		cat >&2 <<EOF
## get__applicant_email parsed variables
_url -> ${_url}
_index_path -> ${_index_path}
_index_dir -> ${_index_dir}
_json_dir -> ${_json_dir}
_json_path -> ${_json_path}
_applicant_email -> ${_applicant_email}
EOF
	fi

	if (( ${#_applicant_email} )); then
		printf '%s' "${_applicant_email}"
	fi
}

build_query_string() {
	local _query_string=''

	if ((${#_email_alias})); then
		_query_string+="email-alias=${_email_alias}"
	fi

	if ((${#_tags})); then
		if ((${#_email_alias})); then
			_query_string+="&tags=${_tags}"
		else
			_query_string+="tags=${_tags}"
		fi
	fi

	printf '%s' "${_query_string}"
}

## Default optional parameters

if ! (( ${#_url} )); then
	_url='http://127.0.0.1:8080/'
fi

if ! (( ${#_applicant_name} )); then
	# _applicant_name="$( jq --raw-output '.title | split("[^\\w]+";"g")[0]' "${__G_DIR__}/assets/json/page-header.json" )"
	_applicant_name="$(get__applicant_name "${_url}")"
fi

if ! (( ${#_pdf_path} )); then
	_out_directory="${HOME}/Downloads/resumes/$(date +%F)"
else
	_out_directory="${_pdf_path%/*}"
fi
if ! [[ -d "${_out_directory}" ]]; then
	mkdir -vp "${_out_directory}"
fi

_tor_directory="${HOME}/.local/share/torbrowser/tbb/x86_64/tor-browser/Browser/Downloads/resumes"
if (( _copy_to_tor )) && ! [[ -d "${_tor_directory}" ]]; then
	mkdir -vp "${_tor_directory}"
fi

if ! (( ${#_pdf_path} )); then
	_file_name="${_applicant_name// /-}_Resume_to_${_company_name// /-}_for_${_job_title// /-}.pdf"

	_pdf_path="${_out_directory}/${_file_name}"
	_tor_path="${_tor_directory}/${_file_name}"
else
	_file_name="#{_pdf_path##*/}"
	_tor_path="${_tor_directory}/${_file_name}"
fi

_chromium_args=(
	--disable-background-networking
	--disable-extensions
	--disable-gpu
	--disable-sync
	--disable-translate
	--headless=new
	--hide-scrollbars
	--incognito
	--mute-audio
	--print-to-pdf-no-header
	--run-all-compositor-stages-before-draw
	--virtual-time-budget=5000000
	--print-to-pdf="${_pdf_path}"
)

_chromium_bin="$(which chromium)"
_chromium_bin="${_chromium_bin:-$(which chrome)}"

## Build dynamic variables

if ((${#_email_alias})); then
	_applicant_email="$(get__applicant_email "${_url}")"
	if ! ((${#_applicant_name})); then
		printf >&2 'Failed to parse email for URL -> %s\n' "${_url}"
		exit 1
	fi
	if ((${#_email_alias})); then
		_applicant_email="$(awk -F '@' -v _email_alias="${_email_alias}" '{
			print $1 "+" _email_alias "@" $2;
		}' <<<"${_applicant_email}")"
	fi
fi

_query_string="$(build_query_string)"

if ((${#_query_string})); then
	_url+="?${_query_string}"
fi

## Do the things

if (( _dry_run )) || (( _verbose )); then
	cat >&2 <<EOF
## Print to PDF via
"${_chromium_bin}" ${_chromium_args[@]} "${_url}" 1>/dev/null 2>&1
EOF
	if (( _copy_to_tor )); then
		cat >&2 <<EOF
## Copy to Tor browser downloads
cp "${_pdf_path}" "${_tor_path}"
EOF
	fi
	if (( _preview )); then
	cat >&2 <<EOF
## Preview with okular
okular "${_pdf_path}"
EOF
	fi
	if ((${#_applicant_name})); then
		cat >&2 <<EOF
## Apply with email address
${_applicant_email}
EOF
	fi
fi

if ! (( _dry_run )); then
	"${_chromium_bin}" "${_chromium_args[@]}" "${_url}" 1>/dev/null 2>&1
	if (( _copy_to_tor )); then
		cp "${_pdf_path}" "${_tor_path}"
	fi
	if (( _preview )); then
		okular "${_pdf_path}"
	fi
	if ((${#_applicant_name})); then
		printf 'E-Mail: %s\n' "${_applicant_email}"
	fi
fi

# vim: noexpandtab
