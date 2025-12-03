package domain

type Product struct {
	ID                  string `json:"id"`
	Name                string `json:"name"`
	Protocol            string `json:"protocol"`
	DefaultModelVersion string `json:"defaultModelVersion"`
}
