import { useState } from "react"
import { Server, Plan } from "@/app/types"
import { toast } from "sonner"
import {
  changeServerAddress,
  changeServerTitle,
  changeServerSpecification,
} from "@/app/_services/subscriptionClientService"
import { FIXED_DOMAIN, MAX_SUBDOMAIN_LENGTH, MAX_TITLE_LENGTH } from "../utils/constants"
import { validateSubdomain } from "../utils/formatters"

export function useServerManagement(
  initialServers: Server[],
  plans: Plan[]
) {
  const [servers, setServers] = useState(initialServers)
  const [editingServer, setEditingServer] = useState<Server | null>(null)
  const [upgradeServer, setUpgradeServer] = useState<Server | null>(null)

  const handleEditServer = async (serverId: string, name: string, address: string) => {
    const server = servers.find(s => s.subscription_id === serverId)
    if (!server) return

    if (name.length > MAX_TITLE_LENGTH) {
      toast("Error", {
        description: `Server name must be ${MAX_TITLE_LENGTH} characters or less.`
      })
      throw new Error("Invalid server name")
    }

    if (address && !validateSubdomain(address, MAX_SUBDOMAIN_LENGTH)) {
      toast("Error", {
        description: `Subdomain must be 1-${MAX_SUBDOMAIN_LENGTH} characters, contain only letters, numbers, and hyphens, and cannot start or end with a hyphen.`
      })
      throw new Error("Invalid subdomain")
    }

    try {
      const nameChanged = name !== server.server_name
      const addressChanged = address !== (server.cname_record_name?.replace(FIXED_DOMAIN, "") || "")

      if (nameChanged) {
        await changeServerTitle(serverId, name)
      }

      if (addressChanged) {
        const newFullAddress = address ? address + FIXED_DOMAIN : ""
        await changeServerAddress(serverId, newFullAddress)
      }

      setServers(prevServers =>
        prevServers.map(server => {
          if (server.subscription_id === serverId) {
            return {
              ...server,
              server_name: name,
              cname_record_name: address ? address + FIXED_DOMAIN : null,
            }
          }
          return server
        })
      )

      toast("Server updated", {
        description: "Server details have been updated successfully."
      })
    } catch (error) {
      toast("Error", {
        description: "Failed to update server details. Please try again."
      })
      throw error
    }
  }

  const handleUpgradeServer = async (serverId: string, specificationId: string) => {
    try {
      await changeServerSpecification(serverId, specificationId)

      const newPlan = plans.find(plan => plan.specification.specification_id === specificationId)
      if (newPlan) {
        setServers(prevServers =>
          prevServers.map(server => {
            if (server.subscription_id === serverId) {
              return {
                ...server,
                specification_title: newPlan.specification.title,
                ram_gb: newPlan.specification.ram_gb,
                vcpu: newPlan.specification.vcpu,
                minor_amount: newPlan.price.minor_amount,
              }
            }
            return server
          })
        )
      }

      toast("Server upgraded", {
        description: "Your server specification has been updated."
      })
    } catch (error) {
      toast("Error", {
        description: "Failed to upgrade server. Please try again."
      })
      throw error
    }
  }

  return {
    servers,
    editingServer,
    setEditingServer,
    upgradeServer,
    setUpgradeServer,
    handleEditServer,
    handleUpgradeServer,
  }
}