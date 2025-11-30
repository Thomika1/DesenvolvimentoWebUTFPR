#!/usr/bin/env python3
"""
Setup RAG ULTRA-LEVE
Usa TF-IDF em vez de deep learning (não congela!)
"""
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from app.rag_simples import RAGSimplificado

def main():
    print("=" * 70)
    print("🚀 Setup RAG ULTRA-LEVE (TF-IDF - SEM CONGELAMENTO)")
    print("=" * 70)
    
    doc_path = "utfpr_vestibular.txt"
    
    if not os.path.exists(doc_path):
        print(f"❌ Arquivo não encontrado: {doc_path}")
        return
    
    print(f"\n📄 Carregando: {doc_path}")
    
    # Criar RAG
    rag = RAGSimplificado()
    
    # Carregar documento
    if not rag.load_document(doc_path, chunk_size=300):
        print("❌ Falha ao carregar")
        return
    
    # Construir índice
    print("\n🔨 Construindo índice TF-IDF (rápido)...")
    if not rag.build_index():
        print("❌ Falha ao construir")
        return
    
    # Salvar
    print("\n💾 Salvando...")
    rag.save_index("rag_index.json")
    
    # Testar
    print("\n🧪 TESTES:")
    test_queries = [
        "Qual é a data do vestibular?",
        "Como se inscrever?",
        "Quais requisitos?"
    ]
    
    for query in test_queries:
        print(f"\n📝 '{query}'")
        results = rag.retrieve(query, k=1)
        if results:
            preview = results[0][:120] + "..." if len(results[0]) > 120 else results[0]
            print(f"   ✅ {preview}")
        else:
            print("   ⚠️ Sem resultados")
    
    print("\n" + "=" * 70)
    print("✅ CONCLUÍDO!")
    print("=" * 70)
    print("\n📌 Próximos passos:")
    print("1. pip install scikit-learn")
    print("2. python3 -m uvicorn main:app --reload --host 0.0.0.0 --port 8000")

if __name__ == "__main__":
    main()
