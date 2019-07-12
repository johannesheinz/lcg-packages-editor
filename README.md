# LCG packages editor

A simple Angular application to edit the `packages.json` file in the [LCG CMake](https://gitlab.cern.ch/sft/lcgcmake/) project at CERN. This tool is used to provide a simple way to edit the package information displayed at the [LCG Info](http://lcginfo.cern.ch/#packages) website but it doesn't provide a way to update the information directly. Instead it provides a JSON file as replacement for the existing `packages.json` in `lcgcmake/documentation/packages.json`.

**Input:** The raw data from CERN's GitLab repository:
```bash
https://gitlab.cern.ch/sft/lcgcmake/raw/master/documentation/packages.json
```

