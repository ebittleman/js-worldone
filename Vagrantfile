# -*- mode: ruby -*-
# vi: set ft=ruby :
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure("2") do |config|
  config.vm.define "app" do |v|
    v.vm.provider "docker" do |d|
      d.build_dir       = "."
      d.expose = [80,443]
      d.ports = ["80:80", "443:443"]
    end
  end
  config.vm.network "forwarded_port", guest: 80, host: 80
end
