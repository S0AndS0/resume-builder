#!/usr/bin/env bash

shopt -s globstar

_args_company_name=( "${@}" )

_patterns_company_name='to_.*'
if (( "${#_args_company_name[@]}" >= 2 )); then
	_regexp_seps_company_name='(-|_)?'
	_patterns_company_name+="$(
		sed -s "s/\s/${_regexp_seps_company_name}/g" <<<"${_args_company_name[*]}"
	)"
else
	_patterns_company_name+="${_args_company_name[*]}"
fi

_glob_pdfs=(
	"${HOME}/Downloads/resumes"/**/*.pdf
	"${HOME}/.local/share/torbrowser/tbb/x86_64/tor-browser/Browser/Downloads/resumes"/**/*.pdf
)

printf '%s\n' "${_glob_pdfs[@]}" |
	grep -iE -- "${_patterns_company_name}" |
	awk '
		BEGIN {
			delete _path_dates;
			delete _path_count;
			delete _path_parts;
		}
		{
			gsub(".*/resumes/", "", $0);

			_count = split($0, _path_parts, "/");
			_path = _path_parts[length(_path_parts)];

			if (_count > 1) {
				_date = _path_parts[1];
				_path_dates[_path] = _date;
			}

			_path_count[_path] += 1;
		}
		END {
			for (_path in _path_count) {
				_count = _path_count[_path];
				_date = _path_dates[_path];
				print _count, _date, _path;
			}
		}' |
	sort -k2 |
	column --table --table-columns 'count,date,file name'

